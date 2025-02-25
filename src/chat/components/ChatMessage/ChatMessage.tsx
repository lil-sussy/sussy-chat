import React, { useState, useEffect, useRef } from "react";
import { Card, Avatar, Button, Space, Typography, Tooltip, Badge } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  EditOutlined,
  RedoOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import { ChatInput } from "@/chat/components/ChatInput";

const { Text } = Typography;

interface ChatMessageProps {
  id: string;
  content: string;
  role: "user" | "assistant";
  onEdit: (id: string, content: string) => void;
  timestamp?: Date;
  tokenCount?: { input?: number; output?: number };
  cost?: number;
  generationTime?: number; // in milliseconds
  isHovering?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  role,
  onEdit,
  timestamp = new Date(),
  tokenCount,
  cost,
  generationTime,
  isHovering,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  return (
    <>
      <div className="mb-1 whitespace-pre-wrap">{content}</div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <Space size="small">
          <Text type="secondary">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </Text>

          {role === "user" && (
            <Space>
              {isHovering && (
                <Tooltip title="Edit (Alt+E)">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                  />
                </Tooltip>
              )}
            </Space>
          )}
        </Space>

        {/* Token info for assistant messages */}
        {role === "assistant" && tokenCount && (
          <Space size="small">
            <Badge
              count={`${tokenCount.input || 0} in / ${tokenCount.output || 0} out`}
              style={{ backgroundColor: "#52c41a" }}
            />

            {cost !== undefined && (
              <Tooltip title="Cost">
                <Space>
                  <DollarOutlined />
                  <span>${cost.toFixed(5)}</span>
                </Space>
              </Tooltip>
            )}

            {generationTime !== undefined && (
              <Tooltip title="Generation time">
                <Space>
                  <ClockCircleOutlined />
                  <span>{(generationTime / 1000).toFixed(2)}s</span>
                </Space>
              </Tooltip>
            )}
          </Space>
        )}
      </div>
    </>
  );
};
export default ChatMessage;