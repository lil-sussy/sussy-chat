import { Button, List, Typography } from "antd";
import { PlusOutlined, MessageOutlined } from "@ant-design/icons";
import { cn } from "@/chat/lib/utils";
import { useChat } from "@/chat/contexts/ChatContext";

const SidebarContent = () => {
  const { chatHistory, handleNewChat, currentChatId, handleSelectChat } =
    useChat();

  return (
    <>
      <div className="border-b border-gray-200 p-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          className="flex w-full items-center justify-center"
        >
          New Chat
        </Button>
      </div>
      <List
        className="flex-1 overflow-y-auto"
        dataSource={chatHistory}
        renderItem={(chat) => (
          <List.Item
            className="border-b border-gray-100 p-0"
            onClick={() => handleSelectChat(chat.id)}
          >
            <Button
              type="text"
              icon={<MessageOutlined />}
              className={cn(
                "w-full justify-start px-4 py-3 text-left hover:bg-gray-100",
                currentChatId === chat.id && "bg-gray-100 font-medium",
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
