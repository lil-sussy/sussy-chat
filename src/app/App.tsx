"use client";

import { useSession } from "next-auth/react";
import ChatContainer from "@/chat/components/ChatContainer";
import Header from "@/app/_components/Header";

export default function App() {
  const { data, status, update } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Unauthenticated</div>;
  }

  return (
    <ChatContainer />
  );
}
