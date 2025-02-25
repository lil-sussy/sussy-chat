"use client";

import { ChangeEventHandler, useState } from "react";
import { Button } from "@/chat/components/ui/button";
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
import { ChatProvider } from "../contexts/ChatContext";
import ChatContainer from "./ChatContainer";

export default function ChatInterface() {


  return (
    <ChatProvider>
      <div className="flex bg-gray-100 h-full">
        <ChatSidebar />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            {/* <CardTitle>Chat Interface</CardTitle> */}
            <ModelSelector />
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ChatContainer />
          </div>
        </div>
        <AISettingsSidebar/>
      </div>
    </ChatProvider>
  );
}
