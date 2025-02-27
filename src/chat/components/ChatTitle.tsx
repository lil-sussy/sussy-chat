import { Button, Input } from "antd";

import { Typography } from "antd";
import { useChat } from "../contexts/ChatContext";

import { Space } from "antd";

import { Tooltip } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AsyncButton } from "@/common/components/AsyncButton";

export const ChatTitle = () => {
  const { selectedChat, handleEditChatTitle } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedChat?.title || "");

  useEffect(() => {
    setEditedTitle(selectedChat?.title || "");
  }, [selectedChat]);

  const handleEditTitleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isEditing) {
      await handleEditChatTitle(editedTitle);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Space size="small" className="gap-2 p-4 pb-2">
      {isEditing ? (
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onPressEnter={() => handleEditChatTitle(editedTitle)}
        />
      ) : (
        <Typography.Title level={3}>{selectedChat?.title}</Typography.Title>
      )}
      {selectedChat && (
        <Tooltip title="Edit (Alt+E)">
          <AsyncButton
            type="text"
            icon={isEditing ? <CheckOutlined /> : <EditOutlined />}
            onClick={handleEditTitleClick}
          />
        </Tooltip>
      )}
    </Space>
  );
};
