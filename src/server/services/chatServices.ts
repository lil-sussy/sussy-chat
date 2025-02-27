import { type Message, type Chat, Prisma } from '@prisma/client';
import { prisma } from '../db';

export const createUserMessage = async (
    chatId: string,
    userId: string,
    content: string,
    parentId?: string
): Promise<Message> => {
    return prisma.message.create({
        data: {
            content,
            role: 'user',
            chatId,
            userId,
            model: 'user-input',
            parentId: parentId || null
        }
    });
};

export const createAiMessage = async (
    chatId: string,
    content: string,
    model: string,
    parentId: string
): Promise<Message> => {
    return prisma.message.create({
        data: {
            content,
            role: 'assistant',
            model,
            chatId,
            parentId
        }
    });
};

export const getMessageHistory = async (
    chatId: string,
    parentId?: string
): Promise<Message[]> => {
    return prisma.message.findMany({
        where: {
            chatId,
            parentId: parentId || null
        },
        orderBy: { createdAt: 'asc' }
    });
};

export const updateChatActiveMessage = async (
    chatId: string,
    activeMessageId: string
): Promise<Chat> => {
    return prisma.chat.update({
        where: { id: chatId },
        data: { activeMessageId }
    });
};

// Add other chat-related Prisma operations as needed 