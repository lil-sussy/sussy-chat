import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createChatService } from "@/server/services/chatServices";
import openRouterService, { type ChatMessage } from "@/server/services/openRouterServices";
import axios from "axios";

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: number;
    completion: number;
  };
}

// Zod schema for model request
const modelRequestSchema = z.object({
  modelIds: z.array(z.string()),
  prompt: z.string(),
  chatId: z.string(),
  parentMessageId: z.string().optional(),
  systemPrompt: z.string().optional(),
  temperature: z.number().optional().default(0.7),
  maxTokens: z.number().optional().default(1000),
});

export const chatRouter = createTRPCRouter({
  // Create a new chat
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chatService = createChatService(ctx.db);
      return chatService.createChat(ctx.session.user.id, input.title);
    }),

  // Get all chats for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const chatService = createChatService(ctx.db);
    return await chatService.getAllChats(ctx.session.user.id);
  }),

  getAllModels: protectedProcedure.query(async ({ ctx }) => {
    const models = await axios.get("https://openrouter.ai/api/v1/models");
    return models.data.data as OpenRouterModel[];
  }),

  // Get a single chat by ID
  getById: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(({ ctx, input }) => {
      const chatService = createChatService(ctx.db);
      return chatService.getChatById(input.chatId, ctx.session.user.id);
    }),
  
  getAllMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(({ ctx, input }) => {
      const chatService = createChatService(ctx.db);
      return chatService.getAllMessagesFromChat(input.chatId);
    }),

  // Generate message with a specific model
  generateWithModel: protectedProcedure
    .input(modelRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { modelIds, prompt, chatId, parentMessageId, systemPrompt, temperature, maxTokens } = input;
      const chatService = createChatService(ctx.db);
      
      // Get the chat to verify ownership
      const chat = await chatService.getChatById(chatId, ctx.session.user.id);
      
      if (!chat) {
        throw new Error("Chat not found or you don't have access");
      }

      // Create user message
      const userMessage = await chatService.createUserMessage({
        content: prompt,
        chatId,
        parentId: parentMessageId || null,
      });

      // Format messages for OpenRouter API
      const messages = openRouterService.formatMessages(prompt, systemPrompt);
      
      try {
        // Call OpenRouter API
        const results = await Promise.allSettled(
          modelIds.map(async (modelId) => {
            return openRouterService.getModelResponse(modelId, messages, temperature, maxTokens);
          })
        );
        // Create assistant message in the database
        const assistantMessages = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            const assistantMessage = await chatService.createAssistantMessage({
              content: result.value.content || "",
              chatId,
              parentId: userMessage.id,
              model: result.value.model,
            });
            assistantMessages.push(assistantMessage);
          }
        }
        
        // Update the user message's children
        await chatService.updateMessageChildren(userMessage.id, assistantMessages[0]?.id || "");
        
        // Update chat's activeMessageId to this new message path
        await chatService.updateChatActiveMessage(chatId, assistantMessages[0]?.id || "");
        
        return assistantMessages;
      } catch (error) {
        console.error("Error calling OpenRouter API:", error);
        throw new Error("Failed to generate response from model");
      }
    }),

  // Generate alternative responses using multiple models
  generateAlternatives: protectedProcedure
    .input(z.object({
      chatId: z.string(),
      parentMessageId: z.string(),
      prompt: z.string(),
      modelIds: z.array(z.string()),
      systemPrompt: z.string().optional(),
      temperature: z.number().optional().default(0.7),
      maxTokens: z.number().optional().default(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const { modelIds, prompt, chatId, parentMessageId, systemPrompt, temperature, maxTokens } = input;
      const chatService = createChatService(ctx.db);
      
      // Verify chat ownership 
      const chat = await chatService.getChatById(chatId, ctx.session.user.id);
      
      if (!chat) {
        throw new Error("Chat not found or you don't have access");
      }
      
      // Create a single user message
      const userMessage = await chatService.createUserMessage({
        content: prompt,
        chatId,
        parentId: parentMessageId || null,
      });
      
      // Format messages for OpenRouter API
      const messages = openRouterService.formatMessages(prompt, systemPrompt);
      
      // Generate responses from all requested models
      const results = await Promise.allSettled(
        modelIds.map(async (modelId) => {
          return openRouterService.getModelResponse(modelId, messages, temperature, maxTokens);
        })
      );
      
      // Create assistant messages for each successful response
      const assistantMessages = [];
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          const assistantMessage = await chatService.createAssistantMessage({
            content: result.value.content || "",
            chatId,
            parentId: userMessage.id,
            model: result.value.model,
          });
          
          assistantMessages.push(assistantMessage);
        }
      }
      
      // Set the first successful response as active if any
      if (assistantMessages.length > 0) {
        await chatService.updateChatActiveMessage(chatId, assistantMessages[0]?.id || "");
      }
      
      return {
        userMessage,
        assistantMessages,
      };
    }),

  // Update the active message branch
  setActiveMessage: protectedProcedure
    .input(z.object({
      chatId: z.string(),
      messageId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const chatService = createChatService(ctx.db);
      
      // Verify chat ownership
      const chat = await chatService.getChatById(input.chatId, ctx.session.user.id);
      
      if (!chat) {
        throw new Error("Chat not found or you don't have access");
      }
      
      // Verify message exists in this chat
      const message = await chatService.getMessageById(input.messageId, input.chatId);
      
      if (!message) {
        throw new Error("Message not found in this chat");
      }
      
      // Update active message
      return chatService.updateChatActiveMessage(input.chatId, input.messageId);
    }),
});
