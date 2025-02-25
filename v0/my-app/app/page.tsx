"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ModelSelector } from "@/components/model-selector"
import { ChatMessage } from "@/components/chat-message"
import { AISettingsSidebar } from "@/components/ai-settings-sidebar"

type ChatHistoryItem = {
  id: string
  title: string
  messages: { id: string; content: string; role: "user" | "assistant" }[]
}

const dummyChats: ChatHistoryItem[] = [
  {
    id: "1",
    title: "Chat about AI",
    messages: [
      { id: "1", content: "What's the latest in AI?", role: "user" },
      {
        id: "2",
        content: "There have been significant advancements in large language models and generative AI recently.",
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
]

export default function ChatInterface() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(dummyChats)
  const [currentChatId, setCurrentChatId] = useState("1")
  const [selectedModel, setSelectedModel] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(150)

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    id: currentChatId,
    body: {
      model: selectedModel,
      systemPrompt,
      temperature,
      maxTokens,
    },
    initialMessages: chatHistory.find((chat) => chat.id === currentChatId)?.messages || [],
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleNewChat = () => {
    const newChatId = String(chatHistory.length + 1)
    setChatHistory([...chatHistory, { id: newChatId, title: `New Chat ${newChatId}`, messages: [] }])
    setCurrentChatId(newChatId)
  }

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id)
    setMessages(chatHistory.find((chat) => chat.id === id)?.messages || [])
  }

  const handleEditMessage = (id: string, newContent: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === id ? { ...msg, content: newContent } : msg))
    setMessages(updatedMessages)

    // Update chat history
    const updatedChatHistory = chatHistory.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat,
    )
    setChatHistory(updatedChatHistory)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        selectedChatId={currentChatId}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <CardTitle>Chat Interface</CardTitle>
          <ModelSelector onSelectModel={setSelectedModel} />
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {messages.map((message) => (
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
                    className="w-full mb-2"
                    rows={4}
                  />
                ) : (
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full mb-2"
                  />
                )}
                <div className="flex justify-between items-center">
                  <Button type="button" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
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
  )
}

