import { Button } from "antd";
import { cn } from "@/chat/lib/utils";
import { useChat } from "@/chat/contexts/ChatContext";


export function ChatSidebar() {
  const { chatHistory, handleSelectChat, handleNewChat, currentChatId } =
    useChat();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full">
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
              currentChatId === chat.id && "bg-gray-100"
            )}
            onClick={() => handleSelectChat(chat.id)}
          >
            {chat.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
