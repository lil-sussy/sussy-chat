"use client";

import { useSession } from "next-auth/react";
import ChatContainer from "@/chat/components/ChatInterface";
import Header from "@/app/_components/Header";
import LoginCard from "./_components/LoginCard";
import { Spin } from "antd";
import { ChatProvider } from "@/chat/contexts/ChatContext";

export default function App() {
  const { data, status, update } = useSession();

  if (status === "loading") {
    return <Spin />;
  }

  if (status === "unauthenticated") {
    return <LoginCard />;
  }

  return (
    <div className="w-full h-full pt-16">
      <ChatProvider>
        <ChatContainer />
      </ChatProvider>
    </div>
  );
}
