import React, { useEffect, useRef } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  keyFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  keyFocus = false,
  onKeyDown,
  placeholder = "Type your message... (Shift+Enter for new line)",
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isExpanded = value.length > 50 || value.includes("\n");

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

  // Handle Shift+Enter for new line
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
    
    // Pass to external handler if provided
    onKeyDown?.(e);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit}>
        <TextArea
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoSize={{ minRows: isExpanded ? 3 : 1, maxRows: 6 }}
          onKeyDown={handleKeyDownInternal}
          className="mb-2"
        />
        <div className="flex justify-end">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SendOutlined />}
            disabled={!value.trim()}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}; 