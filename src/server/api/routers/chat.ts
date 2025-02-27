import { z } from "zod";
import { prisma } from '@/server/db';
import { generateResponses } from '@/server/services/openRouterServices';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createUserMessage,
  createAiMessage,
  updateChatActiveMessage,
  getMessageHistory
} from '@/server/services/chatServices';

export const chatRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(z.object({
      chatId: z.string(),
      content: z.string(),
      models: z.array(z.string()),
      temperature: z.number().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Create user message using service
      const userMessage = await createUserMessage(
        input.chatId,
        ctx.user.id,
        input.content
      );

      // Generate AI responses in parallel
      const aiMessages = await generateResponses(
        userMessage,
        input.models,
        input.temperature
      );

      // Update chat using service
      await updateChatActiveMessage(input.chatId, userMessage.id);

      return {
        userMessage,
        aiMessages
      };
    }),
  chat: createTRPCRouter({
    create: protectedProcedure.input(z.object({
      chat: z.string(), // this should be the prisma type of chat
      models: z.array(z.string()),
    })).mutation(async ({ ctx, input }) => {

    }),
  }),
});
