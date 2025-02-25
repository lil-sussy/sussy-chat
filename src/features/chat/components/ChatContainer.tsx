"use client";

import { useState } from "react";
import { Button } from "@/features/chat/components/ui/button";
import { Input } from "@/features/chat/components/ui/input";
import { Card, CardContent, CardFooter, CardTitle } from "@/features/chat/components/ui/card";
import { ScrollArea } from "@/features/chat/components/ui/scroll-area";
import { Textarea } from "@/features/chat/components/ui/textarea";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";
import { ModelSelector } from "@/features/chat/components/ModelSelector";
import { ChatMessage } from "@/features/chat/components/ChatMessage";
import { AISettingsSidebar } from "@/features/chat/components/AiSettingsSidebar";
import { useChat } from "@/features/chat/hooks/useChat";
import { Message } from "@/features/chat/hooks/useChat";

type ChatHistoryItem = {
  id: string;
  title: string;
  messages: { id: string; content: string; role: "user" | "assistant" }[];
};

const dummyChats: ChatHistoryItem[] = [
  {
    id: "1",
    title: "Chat about AI",
    messages: [
      { id: "1", content: "What's the latest in AI?", role: "user" },
      {
        id: "2",
        content:
          "There have been significant advancements in large language models and generative AI recently.",
        role: "assistant",
      },
    ],
  },
  {
    id: "2",
    title: "Coding help",
    messages: [
      { id: "1", content: "How do I use React hooks?", role: "user" },
      {
        id: "2",
        content:
          "React hooks are functions that let you use state and other React features in functional components. Some common hooks include useState, useEffect, and useContext.",
        role: "assistant",
      },
    ],
  },
];

export default function ChatInterface() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(dummyChats);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [selectedModel, setSelectedModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant.",
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat(currentChatId, {
      model: selectedModel,
      systemPrompt,
      temperature,
      maxTokens,
    },
    chatHistory.find((chat) => chat.id === currentChatId)?.messages || [],
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNewChat = () => {
    const newChatId = String(chatHistory.length + 1);
    setChatHistory([
      ...chatHistory,
      { id: newChatId, title: `New Chat ${newChatId}`, messages: [] },
    ]);
    setCurrentChatId(newChatId);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setMessages(chatHistory.find((chat) => chat.id === id)?.messages || []);
  };

  const handleEditMessage = (id: string, newContent: string) => {
    const updatedMessages = messages.map((msg: { id: string; content: string }) =>
      msg.id === id ? { ...msg, content: newContent } : msg,
    );
    setMessages(updatedMessages);

    // Update chat history
    const updatedChatHistory = chatHistory.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat,
    );
    setChatHistory(updatedChatHistory);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        selectedChatId={currentChatId}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <CardTitle>Chat Interface</CardTitle>
          <ModelSelector onSelectModel={setSelectedModel} />
        </div>
        <div className="flex-1 overflow-auto p-4">
          <Card className="flex h-full flex-col">
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {messages.map((message: Message) => (
                  <ChatMessage
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    role={message.role as "user" | "assistant"}
                    onEdit={handleEditMessage}
                  />
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="w-full">
                {isExpanded ? (
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="mb-2 w-full"
                    rows={4}
                  />
                ) : (
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="mb-2 w-full"
                  />
                )}
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                  <Button type="submit">Send</Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
      <AISettingsSidebar
        onSystemPromptChange={setSystemPrompt}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />
    </div>
  );
}
