import { sepolia as chain } from "viem/chains";
import useDelegatorSmartAccount from "@/hooks/useDelegatorSmartAccount";
import { useWalletClient } from "wagmi";
import { erc7710BundlerActions } from "@metamask/delegation-toolkit/experimental";
import { useAccountAbstractionUtils } from "@/hooks/useAccountAbstractionUtils";
import { useState } from "react";
import { createPublicClient, http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";

// Update the Permission interface to match the granted permissions response
export interface Permission {
  chainId: `0x${string}`; // Align with hex chainId (e.g., "0xaa36a7" for Sepolia)
  address: `0x${string}`;
  expiry: number;
  isAdjustmentAllowed: boolean;
  signer: {
    type: string;
    data: {
      address: `0x${string}`;
    };
  };
  permission: {
    type: string;
    data: {
      maxAmount: string;
      amountPerSecond: string;
      initialAmount: string;
      startTime: number;
      justification: string;
    };
  };
  context: `0x${string}`; // permissionsContext
  accountMeta?: { factory: `0x${string}`; factoryData: `0x${string}` }[];
  signerMeta: {
    delegationManager: `0x${string}`;
  };
}

export interface PermissionData {
  permissions: Permission[];
}

export default function RedeemPermission({ permissionData }: { permissionData: PermissionData }) {
  const { smartAccount } = useDelegatorSmartAccount(); // Delegate’s Smart Account
  const { data: walletClient } = useWalletClient();
  // const { paymasterClient, pimlicoClient } = useAccountAbstractionUtils();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Access the first permission's context, delegationManager, and accountMeta
  const permission = permissionData.permissions[0]; // Assuming single permission
  const permissionsContext = permission?.context;
  const delegationManager = permission?.signerMeta.delegationManager;
  const accountMetadata = permission?.accountMeta;
console.log("Permission Data:", permissionData);
console.log("Permissions Context:", permissionsContext);
console.log("Delegation Manager:", delegationManager);
console.log("Account Metadata:", accountMetadata);
  // Initialize publicClient
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  console.log("Public Client:", publicClient);

  // Initialize bundlerClient with Pimlico
  const bundlerClient = createBundlerClient({
    chain,
    transport: http("https://api.pimlico.io/v2/11155111/rpc?apikey=pim_BuoeQUayjprACeq4WVj5sL"),
    paymaster: true, // Enables paymaster functionality
  }).extend(erc7710BundlerActions());
  console.log("Bundler Client:", bundlerClient);

  const handleRedeemPermission = async () => {
    if (!walletClient || !smartAccount) return;

    try {
      setLoading(true);
      setError(null);
      setStatus(null);

      if (!smartAccount.address) throw new Error("Delegate smart account not initialized");
      if (!permissionData.permissions.length) throw new Error("Permission data not provided");

      // Deploy delegator account if accountMetadata exists
      // if (accountMetadata?.length) {
      //   const { factory, factoryData } = accountMetadata[0];
      //   const deployHash = await walletClient.sendTransaction({
      //     to: factory,
      //     data: factoryData,
      //   });
      //   console.log("Deploying delegator account...",deployHash);

      //   const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
      //   if (deployReceipt.status !== "success") {
      //     throw new Error("Failed to deploy delegator account");
      //   }
      // }
      // console.log("Delegator account deployed successfully!");
      const userOperationHash = await bundlerClient.sendUserOperationWithDelegation({
        publicClient,
        account: smartAccount,
        calls: [
          {
            to: smartAccount.address,
            data: "0x",
            value: 1n,
            permissionsContext,
            delegationManager,
          },
        ],
        maxFeePerGas: 1n,
        maxPriorityFeePerGas: 1n,
        accountMetadata: accountMetadata,
      });

      // Wait for the user operation receipt
      const { receipt } = await bundlerClient.waitForUserOperationReceipt({
        hash: userOperationHash,
        timeout: 60000,
      });

      setStatus("Permission redeemed successfully!");
      console.log("Receipt:", receipt);
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred while redeeming permission";
      setError(errorMessage);
      console.error("Error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 border-4 border-black text-white px-6 py-2 font-bold transform hover:scale-105 transition-transform"
        onClick={handleRedeemPermission}
        disabled={loading || !walletClient || !smartAccount?.address || !permissionData.permissions.length}
      >
        {loading ? "Redeeming..." : "Redeem Permission"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {status && <p className="text-green-500">{status}</p>}
    </div>
  );
}