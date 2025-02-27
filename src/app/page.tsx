import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import ChatContainer from "@/chat/components/ChatInterface";
import Header from "@/app/_components/Header";
import { useSession } from "next-auth/react";
import App from "./App";
import { ConfigProvider } from "antd";
import theme from "@/styles/theme";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.colors.primary,
            colorPrimaryText: theme.colors.primary,
            colorPrimaryBg: theme.colors.background,
            colorPrimaryBgHover: theme.colors.layer1,
            colorText: theme.colors.text,
            colorBgBase: theme.colors.background,
            colorBgElevated: theme.colors.layer1,
            colorBgContainer: theme.colors.transparent,
            colorBgTextHover: theme.colors.primary,
            colorTextBase: theme.colors.text,
          },
          components: {
            Button: {
              colorTextBase: theme.colors.background,
              colorBgBase: theme.colors.primary,
              colorBgTextHover: theme.colors.text,
            },
          },
          hashed: false,
        }}
      >
        <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <Header />
          <App />
        </main>
      </ConfigProvider>
    </HydrateClient>
  );
}
