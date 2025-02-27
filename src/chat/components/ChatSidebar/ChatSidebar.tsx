import { useState, useEffect } from "react";
import { Button, Drawer, List, Typography } from "antd";
import {
  MenuOutlined,
  PlusOutlined,
  MessageOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { cn } from "@/chat/lib/utils";
import { useChat } from "@/chat/contexts/ChatContext";
import SidebarContent from "./SidebarContent";

export function ChatSidebar() {
  const { chatHistory, handleSelectChat, handleNewChat } = useChat();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleChatSelect = (chatId: string) => {
    handleSelectChat(chatId);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // Mobile toggle button
  const mobileToggle = isMobile && (
    <Button
      type="text"
      icon={<MenuOutlined />}
      onClick={() => setDrawerVisible(true)}
      className="left-4 top-4 z-10 rounded-md bg-primary text-background shadow-md hover:bg-primary/80"
      aria-label="Toggle sidebar"
    />
  );

  return (
    <div className="flex w-16 md:w-64">
      <div className="flex h-full w-64 flex-col border-r border-secondary">
        {/* Mobile toggle button */}
        {mobileToggle}
        {/* Desktop sidebar */}
        {!isMobile && <SidebarContent />}
      </div>
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          title="Chat History"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
          closeIcon={<CloseOutlined className="text-text" />}
          className="!bg-background/50 text-text backdrop-blur-3xl"
        >
          <SidebarContent />
        </Drawer>
      )}
    </div>
  );
}
