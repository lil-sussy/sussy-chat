import { Button, List, Typography } from "antd";
import { PlusOutlined, MessageOutlined } from "@ant-design/icons";
import { cn } from "@/chat/lib/utils";
import { useChat } from "@/chat/contexts/ChatContext";

const SidebarContent = () => {
  const { chatHistory, handleNewChat, currentChatId, handleSelectChat } =
    useChat();

  return (
    <>
      <div className="border-b border-secondary p-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          className="flex w-full items-center justify-center bg-primary"
        >
          New Chat
        </Button>
      </div>
      <List
        className="flex-1 overflow-y-auto px-2"
        dataSource={chatHistory}
        renderItem={(chat) => (
          <List.Item
            className="border-b border-secondary p-0"
            onClick={() => handleSelectChat(chat.id)}
          >
            <Button
              type="text"
              icon={<MessageOutlined />}
              className={cn(
                "w-full justify-start bg-secondary px-4 py-3 text-left hover:bg-secondary/80",
                currentChatId === chat.id && "bg-accent/70 font-medium",
              )}
            >
              <Typography.Text ellipsis className="ml-2">
                {chat.title}
              </Typography.Text>
            </Button>
          </List.Item>
        )}
      />
    </>
  );
};

export default SidebarContent;
