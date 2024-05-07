'use client'

import { MoralisProvider } from "react-moralis";
import ManualHeader from "@/components/ManualHeader";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
        <h1>Home Page</h1>
        <ManualHeader />
    </MoralisProvider>
  );
}
