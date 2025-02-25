import { Message, useChat } from "../contexts/ChatContext";
import { Card, CardContent, CardFooter } from "@/chat/components/ui/card";
import { ScrollArea } from "@/chat/components/ui/scroll-area";
import { Textarea } from "@/chat/components/ui/textarea";
import { Button } from "@/chat/components/ui/button";
import { Input } from "@/chat/components/ui/input";
import { ChatMessage } from "@/chat/components/ChatMessage";
import { useState, ChangeEventHandler } from "react";

export default function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, handleEditMessage } =
    useChat();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
          onChange={
            handleInputChange as unknown as ChangeEventHandler<HTMLTextAreaElement>
          }
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
  );
}
