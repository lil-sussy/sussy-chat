"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import AiSettingsContent from "./AiSettingsContent";

export function AISettingsSidebar() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 1023px)' });

  // For mobile: show a button that opens the drawer
  if (isMobile) {
    return (
      <div className="flex w-16 lg:w-64 border-l border-secondary">
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
        >
          <AiSettingsContent />
        </Drawer>
      </div>
    );
  }

  // For desktop: show the sidebar
  return (
    <div className="hidden lg:flex w-64 flex-col border-l border-secondary p-4">
      <AiSettingsContent />
    </div>
  );
}
