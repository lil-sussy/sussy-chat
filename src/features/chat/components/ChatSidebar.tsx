import { Button } from "antd";
import { cn } from "@/features/chat/lib/utils";

type ChatHistoryItem = {
  id: string;
  title: string;
};

type ChatSidebarProps = {
  chatHistory: ChatHistoryItem[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  selectedChatId: string;
};

export function ChatSidebar({
  chatHistory,
  onSelectChat,
  onNewChat,
  selectedChatId,
}: ChatSidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatHistory.map((chat) => (
          <Button
            key={chat.id}
            type="text"
            className={cn(
              "w-full justify-start px-4 py-2 text-left hover:bg-gray-100",
              selectedChatId === chat.id && "bg-gray-100"
            )}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
