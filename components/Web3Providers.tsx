"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import AppProvider from "./AppContext";
import { iliad } from "@story-protocol/core-sdk";

const config = getDefaultConfig({
  appName: "Artcast",
  projectId: "393622bb0dc24c9b4e9a12b518e75adf",
  chains: [iliad],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
