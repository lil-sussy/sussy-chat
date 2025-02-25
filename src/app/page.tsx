import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import ChatContainer from "@/chat/components/ChatContainer";
import Header from "@/app/_components/Header";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <SessionProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <Header />
          <ChatContainer />
        </main>
      </SessionProvider>
    </HydrateClient>
  );
}
