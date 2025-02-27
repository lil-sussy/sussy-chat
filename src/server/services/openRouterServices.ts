import { type Message } from '@prisma/client';
import { prisma } from '../db';
import { getMessageHistory } from './chatServices';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

interface OpenRouterRequest {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    model: string;
    temperature?: number;
}

export const generateResponses = async (
    userMessage: Message,
    models: string[],
    temperature: number = 0.7
): Promise<Message[]> => {
    // Use service to get message history
    const messageHistory = await getMessageHistory(
        userMessage.chatId,
        userMessage.parentId
    );

    // Format messages for OpenRouter API
    const messages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // Create parallel requests for all requested models
    const requests = models.map(async model => {
        try {
            const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://your-domain.com',
                    'X-Title': 'Sussy Chat'
                },
                body: JSON.stringify({
                    messages,
                    model,
                    temperature,
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Create and return the new message
            return prisma.message.create({
                data: {
                    content,
                    role: 'assistant',
                    model,
                    chatId: userMessage.chatId,
                    parentId: userMessage.id // Link to user message as parent
                }
            });
        } catch (error) {
            console.error(`Error generating response for model ${model}:`, error);
            return null;
        }
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean) as Message[];
};