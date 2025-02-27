"use client";

import { ChangeEventHandler, useState } from "react";
import { Input } from "@/chat/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/chat/components/ui/card";
import { ScrollArea } from "@/chat/components/ui/scroll-area";
import { Textarea } from "@/chat/components/ui/textarea";
import { ChatSidebar } from "@/chat/components/ChatSidebar/ChatSidebar";
import { ModelSelector } from "@/chat/components/ModelSelector";
import { ChatMessageContainer } from "@/chat/components/ChatMessage/ChatMessageContainer";
import { AISettingsSidebar } from "@/chat/components/AiSettingsSidebar/AiSettingsSidebar";
import { ChatProvider, useChat } from "../contexts/ChatContext";
import ChatContainer from "./ChatContainer";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { Space, Spin, Tooltip, Typography, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ChatTitle } from "./ChatTitle";

export default function ChatInterface() {
  const { data: session } = useSession();

  if (!session) {
    return <Spin />;
  }

  const { selectedChat } = useChat();
  

  return (
    <div className="flex h-full">
      <ChatSidebar />
      <div className="flex flex-1 flex-col">
        <ChatTitle />
        <div className="flex items-center justify-between border-secondary p-4 pb-2">
          {/* <CardTitle>Chat Interface</CardTitle> */}
          <ModelSelector />
        </div>
        <div className="flex-1 overflow-auto p-4 pt-2">
          <ChatContainer />
        </div>
      </div>
      <AISettingsSidebar />
    </div>
  );
}
