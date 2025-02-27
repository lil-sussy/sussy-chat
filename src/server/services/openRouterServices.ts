import axios from "axios";
import { env } from "@/env";

// OpenRouter API constants
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_REFERER = "https://sussy-chat.example.com";

// Type for OpenRouter API response
export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
  }[];
  model: string;
  // ... other fields from OpenRouter response
}

// Type for message format
export interface ChatMessage {
  role: string;
  content: string;
}

export class OpenRouterService {
  /**
   * Get a response from a specific model via OpenRouter API
   */
  async getModelResponse(
    modelId: string, 
    messages: ChatMessage[], 
    temperature: number = 0.7, 
    maxTokens: number = 1000
  ) {
    try {
      const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        {
          model: modelId,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": OPENROUTER_REFERER,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        modelId,
        content: response.data.choices[0]?.message.content,
        model: response.data.model,
      };
    } catch (error) {
      console.error(`Error with model ${modelId}:`, error);
      throw new Error(`Failed to get response from ${modelId}`);
    }
  }

  /**
   * Format messages for OpenRouter API
   */
  formatMessages(userPrompt: string, systemPrompt?: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }
    
    messages.push({
      role: "user",
      content: userPrompt,
    });
    
    return messages;
  }
}

// Singleton instance for convenience
const openRouterService = new OpenRouterService();

/**
 * Get a response from OpenRouter API
 * @deprecated Use the OpenRouterService class instead
 */
export async function getOpenRouterResponse(
  modelId: string, 
  messages: ChatMessage[], 
  temperature: number = 0.7, 
  maxTokens: number = 1000
) {
  return openRouterService.getModelResponse(modelId, messages, temperature, maxTokens);
}

// Export singleton instance
export default openRouterService;