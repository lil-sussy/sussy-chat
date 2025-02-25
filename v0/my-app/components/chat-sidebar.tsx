import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatHistoryItem = {
  id: string
  title: string
}

type ChatSidebarProps = {
  chatHistory: ChatHistoryItem[]
  onSelectChat: (id: string) => void
  onNewChat: () => void
  selectedChatId: string
}

export function ChatSidebar({ chatHistory, onSelectChat, onNewChat, selectedChatId }: ChatSidebarProps) {
  return (
    <div className="w-64 border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {chatHistory.map((chat) => (
          <Button
            key={chat.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left px-4 py-2 hover:bg-gray-100",
              selectedChatId === chat.id && "bg-gray-100",
            )}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}

