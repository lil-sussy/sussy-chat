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
            //@ts-expect-error theme is not typed
            colorPrimary: theme.colors.primary,
            //@ts-expect-error theme is not typed
            colorPrimaryText: theme.colors.primary,
            //@ts-expect-error theme is not typed
            colorPrimaryBg: theme.colors.background,
            //@ts-expect-error theme is not typed
            colorPrimaryBgHover: theme.colors.layer1,
            //@ts-expect-error theme is not typed
            colorText: theme.colors.text,
            //@ts-expect-error theme is not typed
            colorBgBase: theme.colors.background,
            //@ts-expect-error theme is not typed
            colorBgElevated: theme.colors.layer1,
            colorBgContainer: theme.colors.transparent,
            //@ts-expect-error theme is not typed
            colorBgContainerHover: theme.colors.transparent,
            //@ts-expect-error theme is not typed
            colorBgTextHover: theme.colors.primary,
            //@ts-expect-error theme is not typed
            colorBgText: theme.colors.text,
            //@ts-expect-error theme is not typed
            colorTextBase: theme.colors.text,
            //@ts-expect-error theme is not typed
            colorTextBaseHover: theme.colors.text,
            //@ts-expect-error theme is not typed
            colorTextBaseActive: theme.colors.text,
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
