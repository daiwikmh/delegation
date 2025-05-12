import DeployDelegatorButton from "./DeployDelegatorButton";
import CreateDelegateButton from "./CreateDelegateButton";
import CreateDelegationButton from "./CreateDelegationButton";
import { useStepContext } from "@/hooks/useStepContext";
import useDelegateSmartAccount from "@/hooks/useDelegateSmartAccount";
import useDelegatorSmartAccount from "@/hooks/useDelegatorSmartAccount";
import SmartAccount from "./SmartAccount";
import RedeemPermission from "./RedeemDelegationButton";
import { useState } from "react";

export default function Hero() {
  const { step } = useStepContext();
  const { smartAccount } = useDelegatorSmartAccount();
  const [grantedPermissions, setGrantedPermissions] = useState<any[]>([]);



  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <div className="relative">
              <div className="absolute -left-8 top-0 h-16 w-16 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="absolute -right-8 bottom-0 h-16 w-16 bg-blue-600 border-4 border-black -rotate-12"></div>
              <h1 className="relative z-10 font-black text-6xl tracking-tighter mb-4">
                Delegate Your
                <span className="text-blue-600"> Wallet</span>
              </h1>
            </div>
            <p className="text-xl font-mono max-w-2xl mx-auto mt-8">
              Deploy your delegator account and start managing your digital assets with enhanced security and flexibility.
            </p>
            {smartAccount && (
              <p className="text-lg font-mono text-green-600 mt-4">
                Smart Account Address: {smartAccount.address}
              </p>
            )}
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="transform hover:scale-105 transition-transform">
              <DeployDelegatorButton />
            </div>
            
              <div className="max-w-2xl">
                <p className="text-block mb-4 font-mono">
                  The MetaMask smart contract account that receives the delegation.
                  Initially this will be counterfactual (not deployed on-chain), until
                  it is deployed by submitting a user operation
                </p>
                <div className="transform hover:scale-105 transition-transform">
                <SmartAccount onPermissionsGranted={setGrantedPermissions} />
                </div>
              </div>
            

              <div className="max-w-2xl">
                <p className="text-block mb-4 font-mono">
                  The delegator creates and signs a delegation, granting specific
                  authority to the delegate account. In this case, the delegation can
                  be used to perform any transaction on delegator's behalf.
                  <br />
                  <br />
                  To restrict the delegate account to only perform specific actions,
                  the delegator can specify a caveats array in the delegation.
                </p>
                <div className="transform hover:scale-105 transition-transform">
                <RedeemPermission permissionData={{ permissions: grantedPermissions  }} />
                </div>
              </div>
         
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 h-24 w-24 bg-yellow-500 border-4 border-black -rotate-12 opacity-20"></div>
      <div className="absolute right-0 top-1/4 h-24 w-24 bg-blue-600 border-4 border-black rotate-12 opacity-20"></div>
    </section>
  );
}