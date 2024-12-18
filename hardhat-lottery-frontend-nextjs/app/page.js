'use client'

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Header from "@/components/Header";
// import ManualHeader from "@/components/ManualHeader";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <h1>Home Page</h1>
        <Header />
        {/* <ManualHeader /> */}
      </NotificationProvider>
    </MoralisProvider>
  );
}
