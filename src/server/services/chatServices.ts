import { type PrismaClient, type Prisma, type Role } from "@prisma/client";

export class ChatService {
  constructor(private prisma: PrismaClient) {}

  // Chat CRUD operations
  async createChat(userId: string, title: string) {
    const chat = await this.prisma.chat.create({
      data: {
        title,
        userId,
      },
    });
    return await this.prisma.chat.findUnique({
      where: {
        id: chat.id,
      },
      include: {
        messages: true,
      },
    });
  }

  async getAllChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async getChatById(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    
    if (!chat) return null;
    
    return {
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map(message => ({
        ...message,
        createdAt: new Date(message.createdAt)
      }))
    };
  }

  async getAllMessagesFromChat(chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
    });
    
    return messages.map(message => ({
      ...message,
      createdAt: new Date(message.createdAt)
    }));
  }
  
  async updateChatActiveMessage(chatId: string, messageId: string) {
    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        activeMessageId: messageId,
      },
    });
  }

  // Message operations
  async createUserMessage({
    content,
    chatId,
    parentId,
  }: {
    content: string;
    chatId: string;
    parentId: string | null;
  }) {
    const message = await this.prisma.message.create({
      data: {
        content,
        role: "user" as Role,
        model: "user",
        chatId,
        parentId: parentId || null,
      },
    });
    
    return {
      ...message,
      createdAt: new Date(message.createdAt)
    };
  }

  async createAssistantMessage({
    content,
    chatId,
    parentId,
    model,
  }: {
    content: string;
    chatId: string;
    parentId: string;
    model: string;
  }) {
    const message = await this.prisma.message.create({
      data: {
        content,
        role: "assistant" as Role,
        model,
        chatId,
        parentId,
      },
    });
    
    return {
      ...message,
      createdAt: new Date(message.createdAt)
    };
  }

  async updateMessageChildren(messageId: string, childId: string) {
    return this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        children: {
          connect: {
            id: childId,
          },
        },
      },
    });
  }

  async getMessageById(messageId: string, chatId: string) {
    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        chatId,
      },
    });
    
    if (!message) return null;
    
    return {
      ...message,
      createdAt: new Date(message.createdAt)
    };
  }
}

// Factory function to create a chat service with the provided Prisma instance
export function createChatService(prisma: PrismaClient) {
  return new ChatService(prisma);
} 