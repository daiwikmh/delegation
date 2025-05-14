import { useState } from "react";
import { sepolia } from "viem/chains";
import { erc7715ProviderActions } from "@metamask/delegation-toolkit/experimental";
import { usePermissions } from "@/utils/PermissionProvider";
import useDelegatorSmartAccount from "@/hooks/useDelegatorSmartAccount";
import { useWalletClient } from "wagmi";

export default function GrantPermissionsButton() {
  const { smartAccount } = useDelegatorSmartAccount();
  const { savePermission } = usePermissions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();

  const handleGrantPermissions = async () => {
    if (!smartAccount) {
      console.error("Session account not found");
      return;
    }

    setIsLoading(true);
    try {
      const extendedClient = walletClient!.extend(erc7715ProviderActions());

      const currentTime = Math.floor(Date.now() / 1000);
      const oneDayInSeconds = 24 * 60 * 60;
      const expiry = currentTime + oneDayInSeconds;

      const permissions = await extendedClient.grantPermissions([
        {
          chainId: sepolia.id,
          expiry,
          signer: {
            type: "account",
            data: {
              address: smartAccount.address,
            },
          },
          permission: {
            type: "native-token-stream",
            data: {
              initialAmount: 1n,
              amountPerSecond: 1n,
              startTime: currentTime,
              maxAmount: 10n,
              justification: "Payment for a subscription service",
            },
          },
        },
      ]);
      console.log("Permissions granted:", permissions);
      console.log("Permission to save:", permissions[0]);
      savePermission(permissions[0]);
      console.log("Stored permission:", sessionStorage.getItem("gator-permission"));
    } catch (error) {
      console.error("Error granting permissions:", error);
    } finally {
      setIsLoading(false);
      console.log("Grant permissions done");
    }
  };

  return (
    <button
      onClick={handleGrantPermissions}
      disabled={isLoading || !smartAccount || !walletClient}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 border-4 border-black text-white px-6 py-2 font-bold transform hover:scale-105 transition-transform"
    >
      {isLoading ? "Granting..." : "Grant Permissions"}
    </button>
  );
}