import { useState, useEffect } from "react";
import { Button, Drawer, List, Typography } from "antd";
import { MenuOutlined, PlusOutlined, MessageOutlined } from "@ant-design/icons";
import { cn } from "@/chat/lib/utils";
import { useChat } from "@/chat/contexts/ChatContext";
import SidebarContent from "./SidebarContent";

export function ChatSidebar() {
  const { chatHistory, handleSelectChat, handleNewChat, currentChatId } = useChat();
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
      className="top-4 left-4 z-10 bg-white shadow-md rounded-md"
      aria-label="Toggle sidebar"
    />
  );

  return (
    <div className="flex w-16 md:w-64">
      {/* Mobile toggle button */}
      {mobileToggle}
      
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="flex w-64 flex-col border-r border-gray-200 h-full">
          <SidebarContent />
        </div>
      )}
      
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          title="Chat History"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
          <SidebarContent />
        </Drawer>
      )}
    </div>
  );
}
