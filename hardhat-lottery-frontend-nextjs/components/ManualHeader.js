"use client";

import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
        window.localStorage.getItem("connected")
        enableWeb3()
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
        console.log(`Account changed to ${account}`);
        if (account == null) {
            window.localStorage.removeItem("connected")
            deactivateWeb3()
            console.log("Null account found");
        }
    })
  }, [])

  return (
    <div>
      <h1> Manual Header </h1>
      {account ? (
        <div>
          <button>Connected!</button>
          <p>
            {" "}
            Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
          </p>
        </div>
      ) : (
        <button onClick={async () => {
            await enableWeb3()
            if(typeof window !== "undefined"){
                window.localStorage.setItem("connected", "injected")
            }
        }}> Connect </button>
      )}
    </div>
  );
}
