import { sepolia as chain } from "viem/chains";
import useDelegatorSmartAccount, { smartAccount } from "@/hooks/useDelegatorSmartAccount";
import { useWalletClient } from "wagmi";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { erc7715ProviderActions } from "@metamask/delegation-toolkit/experimental";

export default function SmartAccount({ onPermissionsGranted }: { onPermissionsGranted: (permissions: any[]) => void }) {
    const { smartAccount } = useDelegatorSmartAccount();
    const expiry = Math.floor(Date.now() / 1000 + 604_800);
  const currentTime = Math.floor(Date.now() / 1000);
  const { data: walletClient } = useWalletClient();

  const handleGrantPermissions = async () => {
    if (!walletClient) return;

      const extendedClient = walletClient.extend(erc7715ProviderActions());

      // Ensure MetaMask is on Sepolia
      const currentChainId = await extendedClient.getChainId();
      if (currentChainId !== chain.id) {
        throw new Error(
          `Please switch MetaMask to the Sepolia network (chain ID: ${chain.id})`
        );
      }

    const grantedPermissions = await extendedClient.grantPermissions([{
      chainId: chain.id,
      expiry,
      signer: {
        type: "account",
        data: {
          address: smartAccount?.address,
        },
      },
      permission: {
        type: "native-token-stream",
        data: {
          initialAmount: 5n,
          amountPerSecond: 1n,
          maxAmount: 10n,
          startTime: currentTime,
          justification: "Payment for a week long subscription",
        },
      },
    }]);
console.log(grantedPermissions);
onPermissionsGranted(grantedPermissions);

};

  return (
    <button
      onClick={handleGrantPermissions}
      className="bg-blue-600 hover:bg-blue-700 border-4 border-black text-white px-6 py-2 font-bold transform hover:scale-105 transition-transform"
    >
      Grant Permissions
    </button>
  );
}

  
