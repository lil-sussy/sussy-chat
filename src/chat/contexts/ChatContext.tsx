import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/trpc/react";
import { Chat, Message } from "@prisma/client";

interface ChatBody {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChatHistory: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
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
  sendMessage: (text: string) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
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
  const [chatHistory, setChatHistory] = useState<Chat[]>(chats || []);
  const lastChat = chats? chats[chats.length - 1] : null;
  const [messages, setMessages] = useState<Message[]>(lastChat?.messages || []);
  const [selectedModel, setSelectedModel] = useState<string>(initialChatBody.model);
  const [systemPrompt, setSystemPrompt] = useState<string>(initialChatBody.systemPrompt);
  const [temperature, setTemperature] = useState<number>(initialChatBody.temperature);
  const [maxTokens, setMaxTokens] = useState<number>(initialChatBody.maxTokens);
  const [currentChatId, setCurrentChatId] = useState<string | null>(lastChat?.id || null);
  const newChatMutation = api.chat.create.useMutation();

  const handleNewChat = async () => {
    const newChatId = String(chatHistory.length + 1);
    const newChat = await newChatMutation.mutateAsync({
      title: `New Chat ${newChatId}`,
    });
    setChatHistory([
      ...chatHistory,
      newChat
    ]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setMessages(chatHistory.find((chat) => chat.id === id)?.messages || []);
  };

  const handleEditMessage = (id: string, newContent: string) => {
    const updatedMessages = messages.map((msg: Message) =>
      msg.id === id ? { ...msg, content: newContent } : msg,
    );
    setMessages(updatedMessages);

    // Update chat history
    const updatedChatHistory = chatHistory.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat,
    );
    setChatHistory(updatedChatHistory);
  };
  
  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const input = messages[messages.length - 1]?.content || "";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: e.target.value, role: "user" },
    ]);
  };
  const handleSubmit = () => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: input, role: "user" },
    ]);
  };

  const value = {
    input,
    setChatHistory,
    handleInputChange,
    handleSubmit,
    setMessages,
    messages,
    selectedModel,
    setSelectedModel,
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
    sendMessage,
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
