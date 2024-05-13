'use client'

import { MoralisProvider } from "react-moralis";
import Header from "@/components/Header";
// import ManualHeader from "@/components/ManualHeader";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
        <h1>Home Page</h1>
        <Header />
        {/* <ManualHeader /> */}
    </MoralisProvider>
  );
}
