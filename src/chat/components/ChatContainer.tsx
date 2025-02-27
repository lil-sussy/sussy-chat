import { useChat } from "../contexts/ChatContext";
import { Card } from "antd";
import { ChatMessageContainer } from "@/chat/components/ChatMessage/ChatMessageContainer";
import { ChatInput } from "@/chat/components/ChatInput";
import { ChangeEvent } from "react";
import { Message } from "prisma/prisma-client";

export default function ChatContainer() {
  const {
    messages,
    handleSubmit,
    handleEditMessage,
  } = useChat();


  return (
    <Card 
      className="flex h-full flex-col" 
    >
      <div className="flex-1 overflow-auto mb-4 pr-2">
        {messages?.map((message: Message) => (
          <ChatMessageContainer
            key={message.id}
            id={message.id}
            content={message.content}
            role={message.role as "user" | "assistant"}
            onEdit={handleEditMessage}
          />
        ))}
      </div>
      
      <div className="mt-auto">
        <ChatInput
          keyFocus={true}
        />
      </div>
    </Card>
  );
}
