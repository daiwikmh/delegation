import { useConnect } from "wagmi";
import { Button } from "@/components/ui/button"
import { Circle, Square } from "lucide-react";
import { useState } from "react";

export default function ConnectButton() {
  const { connect, connectors } = useConnect();
  const [darkMode, setDarkMode] = useState(false);

  const connector = connectors[0];



  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
      >
        {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
      </button>
      {connectors.map(() => (
        <Button
          className="bg-blue-600 hover:bg-blue-700 border-4 border-black text-white px-6 py-2 font-bold"
          onClick={() => connect({ connector })}
          key={connector.id}
        >
          Connect Metamask
        </Button>
      ))}
    </div>
  );
}
