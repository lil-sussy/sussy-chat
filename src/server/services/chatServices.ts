import { type PrismaClient, type Prisma, type Role } from "@prisma/client";

export class ChatService {
  constructor(private prisma: PrismaClient) {}

  // Chat CRUD operations
  async createChat(userId: string, title: string) {
    return this.prisma.chat.create({
      data: {
        title,
        userId,
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
    return this.prisma.chat.findFirst({
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
    return this.prisma.message.create({
      data: {
        content,
        role: "user" as Role,
        model: "user",
        chatId,
        parentId: parentId || null,
      },
    });
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
    return this.prisma.message.create({
      data: {
        content,
        role: "assistant" as Role,
        model,
        chatId,
        parentId,
      },
    });
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
    return this.prisma.message.findFirst({
      where: {
        id: messageId,
        chatId,
      },
    });
  }
}

// Factory function to create a chat service with the provided Prisma instance
export function createChatService(prisma: PrismaClient) {
  return new ChatService(prisma);
} 