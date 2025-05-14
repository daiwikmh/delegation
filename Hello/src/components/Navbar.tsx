"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Circle, Square } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [darkMode, setDarkMode] = useState(false);

  // Exactly like in the working example
  const connector = connectors[0];

  return (
    <div className={`min-h-screen font-mono ${darkMode ? "dark" : ""}`}>
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-primary">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12"></div>
              <span className="font-black text-2xl tracking-tighter ml-4 text-black">GASLESS DEX</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </button>

            {/* Use exact same logic as working navbar */}
            {isConnected ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-black">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                <button
                  className="bg-red-500 hover:bg-red-600 border-4 border-black text-white px-4 py-1 rounded-md"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button
                onClick={() => connect({ connector })}
                className="bg-blue-600 hover:bg-blue-700 border-4 border-black text-white px-6 py-2 font-bold"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}