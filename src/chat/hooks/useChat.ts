import { useState } from "react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatBody {
  model: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number,
}
interface ChatHistoryItem {
  id: string;
  title: string;
}

export function useChat(id: string,
  body: ChatBody,
  initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedModel, setSelectedModel] = useState<string>(body.model);
  const [systemPrompt, setSystemPrompt] = useState<string>(body.systemPrompt);
  const [temperature, setTemperature] = useState<number>(body.temperature);
  const [maxTokens, setMaxTokens] = useState<number>(body.maxTokens);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user"
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    // Add logic to load chat history
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    // Add logic to create new chat
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg => 
        msg.id === id ? {...msg, content: newContent} : msg
      )
    );
  };

  const input = messages[messages.length - 1]?.content || "";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), content: e.target.value, role: "user" }]);
  };
  const handleSubmit = () => {
    setMessages(prev => [...prev, { id: Date.now().toString(), content: input, role: "user" }]);
  };

  return {
    input, handleInputChange, handleSubmit, setMessages,
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
    sendMessage
  };
} 