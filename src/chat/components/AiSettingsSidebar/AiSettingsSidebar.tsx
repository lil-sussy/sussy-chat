"use client";

import { useState, useEffect } from "react";
import { Input, Button, Slider, Drawer, Typography, Space } from "antd";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";
import AiSettingsContent from "./AiSettingsContent";

const { Title, Text } = Typography;

export function AISettingsSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
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

  // For mobile: show a button that opens the drawer
  if (isMobile) {
    return (
      <div className="flex w-16 md:w-64">
        <Button
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          className="fixed right-4 bottom-20 z-10 shadow-lg"
          onClick={() => setDrawerVisible(true)}
        />
        
        <Drawer
          title="AI Settings"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={300}
          bodyStyle={{ padding: "12px" }}
        >
          <AiSettingsContent />
        </Drawer>
      </div>
    );
  }

  // For desktop: show the sidebar
  return (
    <div className="hidden md:flex w-64 flex-col border-l border-gray-200 p-4 bg-white">
      <AiSettingsContent />
    </div>
  );
}
