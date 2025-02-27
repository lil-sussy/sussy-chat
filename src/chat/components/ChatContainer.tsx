import { useChat } from "../contexts/ChatContext";
import { Card } from "antd";
import { ChatMessageContainer } from "@/chat/components/ChatMessage/ChatMessageContainer";
import { ChatInput } from "@/chat/components/ChatInput";
import { ChangeEvent } from "react";
import { Message } from "prisma/prisma-client";

export default function ChatContainer() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleEditMessage,
  } = useChat();

  // Create a wrapper function to handle the type mismatch
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // The actual value we care about is the same in both event types
    handleInputChange(e as unknown as ChangeEvent<HTMLInputElement>);
  };

  return (
    <Card 
      className="flex h-full flex-col" 
      bodyStyle={{ height: 'calc(100% - 57px)', padding: '12px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1 overflow-auto mb-4 pr-2">
        {messages.map((message: Message) => (
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
          value={input}
          onChange={handleTextAreaChange}
          onSubmit={handleSubmit}
          keyFocus={true}
        />
      </div>
    </Card>
  );
}
