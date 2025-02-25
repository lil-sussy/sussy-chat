"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, Avatar, Button, Space, Typography, Tooltip, Badge } from "antd";
import { UserOutlined, RobotOutlined, EditOutlined, RedoOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import { ChatInput } from "@/chat/components/ChatInput";
import ChatMessage from "./ChatMessage";


interface ChatMessageProps {
  id: string;
  content: string;
  role: "user" | "assistant";
  onEdit: (id: string, content: string) => void;
  timestamp?: Date;
  // Optional props for AI messages
  tokenCount?: { input?: number; output?: number };
  cost?: number;
  generationTime?: number; // in milliseconds
}

export const ChatMessageContainer: React.FC<ChatMessageProps> = ({
  id,
  content,
  role,
  onEdit,
  timestamp = new Date(),
  tokenCount,
  cost,
  generationTime,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isHovering, setIsHovering] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // Setup keyboard shortcut for editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+E to edit when hovering or edit last user message
      if (e.altKey && e.key === 'e') {
        if (role === 'user' && (isHovering || document.activeElement === messageRef.current)) {
          e.preventDefault();
          setIsEditing(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, isHovering]);

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedContent.trim() !== '') {
      onEdit(id, editedContent);
      setIsEditing(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter to send edit
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmitEdit(e as unknown as React.FormEvent);
    }
  };

  // Avatar based on role
  const avatar = role === 'assistant' ? (
    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1677ff' }} />
  ) : (
    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
  );

  return (
    <div 
      ref={messageRef}
      className={`my-4 flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`max-w-[80%] ${role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <Card 
          bordered={false}
          className={`${role === 'assistant' ? 'bg-gray-50' : 'bg-blue-50'}`}
          bodyStyle={{ padding: '12px' }}
        >
          <div className="flex items-start">
            {role === 'assistant' && <div className="mr-3 mt-1">{avatar}</div>}
            <div className="flex-1">
              {isEditing ? (
                <ChatInput
                  value={editedContent}
                  onChange={handleEditInputChange}
                  onSubmit={handleSubmitEdit}
                  onKeyDown={handleKeyDown}
                  keyFocus={true}
                  placeholder="Edit your message... (Ctrl+Enter to save)"
                />
              ) : (
                <ChatMessage
                  id={id}
                  content={content}
                  role={role}
                  onEdit={onEdit}
                  timestamp={timestamp}
                  tokenCount={tokenCount}
                  cost={cost}
                  generationTime={generationTime}
                  isHovering={isHovering}
                />
              )}
            </div>
            {role === 'user' && <div className="ml-3 mt-1">{avatar}</div>}
          </div>
        </Card>
        
        {/* Regenerate button for user messages */}
        {role === 'user' && !isEditing && (
          <div className="flex justify-end mt-1">
            <Button 
              type="text" 
              size="small" 
              icon={<RedoOutlined />}
              onClick={() => {
                // Trigger regeneration
                // This should be implemented based on your app's logic
                console.log("Regenerate response for message:", id);
              }}
            >
              Regenerate response
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
