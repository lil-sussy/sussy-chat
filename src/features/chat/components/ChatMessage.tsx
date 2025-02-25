"use client";

import { useState } from "react";
import { Avatar } from "@/features/chat/components/ui/avatar";
import { Button } from "@/features/chat/components/ui/button";
import { Input } from "@/features/chat/components/ui/input";
import { ChevronDown, ChevronUp, Edit, Save } from "lucide-react";

type ChatMessageProps = {
  id: string;
  content: string;
  role: "user" | "assistant";
  onEdit?: (id: string, newContent: string) => void;
};

export function ChatMessage({ id, content, role, onEdit }: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSave = () => {
    onEdit?.(id, editedContent);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex items-start ${role === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <Avatar className="mr-2 h-8 w-8">{role === "user" ? "U" : "AI"}</Avatar>
        <div className="flex flex-col">
          <div
            className={`rounded-lg p-2 ${role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            ) : (
              <>
                {isEditing ? (
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="mb-2"
                  />
                ) : (
                  <p>{content}</p>
                )}
              </>
            )}
          </div>
          {!isCollapsed && (
            <div className="mt-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              {role === "user" &&
                (isEditing ? (
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
