import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/trpc/react";
import { Message } from "@prisma/client";
import { OpenRouterModel } from "@/server/api/routers/chat";
import { Prisma } from "@prisma/client";

type Chat = Prisma.ChatGetPayload<{
  include: {
    messages: true;
  };
}>;

interface ChatBody {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface ChatContextType {
  messages: Message[] | undefined;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  setChatHistory: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  maxTokens: number;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
  chatHistory: Chat[];
  currentChatId: string | null;
  handleSelectChat: (id: string) => void;
  handleNewChat: () => void;
  handleEditMessage: (id: string, newContent: string) => void;
  handleSubmit: (userPrompt: string) => Promise<void>;
  allModels: OpenRouterModel[]|undefined;
}

interface ChatProviderProps {
  children: ReactNode;
  initialChatBody?: ChatBody;
  initialMessages?: Message[];
}

// Create the context with a default undefined value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Default values for ChatBody
const defaultChatBody: ChatBody = {
  model: "gpt-4o-mini",
  systemPrompt: "You are a helpful assistant.",
  temperature: 0.7,
  maxTokens: 5000,
};

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialChatBody = defaultChatBody,
  initialMessages = [],
}) => {
  const { data: chats } = api.chat.getAll.useQuery();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const lastChat = chats? chats[chats.length - 1] : null;
  const [selectedModels, setSelectedModels] = useState<string[]>([initialChatBody.model]);
  const { data: allModelsData } = api.chat.getAllModels.useQuery();
  const allModels = allModelsData as OpenRouterModel[]|undefined;
  const [selectedChat, setSelectedChat] = useState<Chat | null>(lastChat as unknown as Chat || null);
  const messages = selectedChat?.messages;
  const [systemPrompt, setSystemPrompt] = useState<string>(initialChatBody.systemPrompt);
  const [temperature, setTemperature] = useState<number>(initialChatBody.temperature);
  const [maxTokens, setMaxTokens] = useState<number>(initialChatBody.maxTokens);
  const [currentChatId, setCurrentChatId] = useState<string | null>(lastChat?.id || null);
  
  const newChatMutation = api.chat.create.useMutation();
  const sendMessageMutation = api.chat.generateWithModel.useMutation();
  // const { data: messages } = api.chat.getAllMessages.useQuery({
  //   chatId: currentChatId || "",
  // });

  // Update state when chats data is available
  React.useEffect(() => {
    if (chats) {
      setChatHistory(chats as unknown as Chat[]);
    }
  }, [chats]);

  const handleNewChat = async () => {
    const newChatId = String(chatHistory.length + 1);
    const newChat = await newChatMutation.mutateAsync({
      title: `New Chat ${newChatId}`,
    });
    setChatHistory([
      ...chatHistory,
      newChat as unknown as Chat
    ]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const handleEditMessage = (id: string, newContent: string) => {
    const updatedMessages = messages?.map((msg: Message) =>
      msg.id === id ? { ...msg, content: newContent } : msg,
    );

    // Update chat history
    const updatedChatHistory = chatHistory.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat,
    );
    setChatHistory(updatedChatHistory);
  };

  const handleSubmit = async (userPrompt: string) => {
    await sendMessageMutation.mutateAsync({
      modelIds: selectedModels,
      prompt: userPrompt,
      chatId: currentChatId || "",
      parentMessageId: messages? messages[messages.length - 1]?.id : undefined,
      systemPrompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
    });
  };

  const value = {
    setChatHistory,
    handleSubmit,
    messages,
    selectedChat,
    setSelectedChat,
    allModels,
    selectedModels,
    setSelectedModels,
    systemPrompt,
    setSystemPrompt,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    chatHistory,
    currentChatId,
    handleSelectChat,
    handleNewChat,
    handleEditMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
