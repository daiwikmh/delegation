import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, linea, lineaSepolia, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import "./index.css";
import { AppProvider } from "./providers/AppProvider";



const config = createConfig({
  ssr: true, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    
    [sepolia.id]: http(),

  },
});

const queryClient = new QueryClient();



createRoot(document.getElementById("root")!).render(
  <StrictMode>
 <WagmiProvider config={config}>
 <QueryClientProvider client={queryClient}>   
 <AppProvider>

      <App />
      </AppProvider>

      </QueryClientProvider>
      </WagmiProvider>
  </StrictMode>
);
