import React, { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useChat } from "../contexts/ChatContext";

const { TextArea } = Input;

interface ChatInputProps {
  keyFocus?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  keyFocus = false,
  placeholder = "Type your message... (Shift+Enter for new line)",
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const { handleSubmit } = useChat();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (keyFocus) {
      inputRef.current?.focus();
    }
  }, [keyFocus]);

  useEffect(() => {
    if (userPrompt.length > 50 || userPrompt.includes("\n")) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [userPrompt]);

  // Focus input on any key press if keyFocus is true
  useEffect(() => {
    if (!keyFocus) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in another input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      
      // Skip for system key combinations
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyFocus]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(userPrompt);
  };

  // Handle Shift+Enter for new line
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userPrompt.trim()) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-row gap-2">
        <TextArea
          ref={inputRef}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={placeholder}
          autoSize={{ minRows: isExpanded ? 3 : 1, maxRows: 20 }}
          onKeyDown={handleKeyDownInternal}
          className="mb-2 bg-background/50 backdrop-blur-3xl hover:bg-background/70 active:bg-background/70 focus:bg-background/70"
        />
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            disabled={!userPrompt.trim()}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}; 