import useDelegateSmartAccount from "@/hooks/useDelegateSmartAccount";
import useDelegatorSmartAccount from "@/hooks/useDelegatorSmartAccount";
import { useStepContext } from "@/hooks/useStepContext";
import useStorageClient from "@/hooks/useStorageClient";
import { prepareRootDelegation } from "@/utils/delegationUtils";
import { createCaveatBuilder, createDelegation } from '@metamask/delegation-toolkit';
import { toHex } from "viem";


const AFTER_TIMESTAMP_ENFORCER_ADDRESS = '0x22Ae4c4919C3aB4B5FC309713Bf707569B74876F';

export default function CreateDelegationButton() {
  const { smartAccount } = useDelegatorSmartAccount();
  const { storeDelegation } = useStorageClient();
  const tenAM = 10 * 60 * 60; // 10:00 AM as seconds since midnight.

  const { smartAccount: delegateSmartAccount } = useDelegateSmartAccount();
  const { changeStep } = useStepContext();

  const handleCreateDelegation = async () => {
    if (!smartAccount || !delegateSmartAccount) {
      console.error("Smart accounts not available");
      return;
    }
    try {

  const environment = smartAccount.environment;
  const caveatBuilder = createCaveatBuilder(environment, { allowEmptyCaveats: true });      
  const caveats = caveatBuilder

        .addCaveat('erc20TransferAmount', "0x4D6B78F996Db4c02Acb9Be98a7B1Fa3534B43CDd",   1_000_000n
        ) // 100 USDC
        .addCaveat({
          enforcer: AFTER_TIMESTAMP_ENFORCER_ADDRESS,
          terms: toHex(tenAM)
        })
        .build();


    if (!smartAccount || !delegateSmartAccount) return;
    console.log(smartAccount.address, delegateSmartAccount.address);
    
    const delegation = await createDelegation({
      to: delegateSmartAccount.address,
      from: smartAccount.address,
      caveats,
    });

    const signature = await smartAccount.signDelegation({
      delegation,
    });

    const signedDelegation = {
      ...delegation,
      signature,
    };

    console.log(signedDelegation);
    storeDelegation(signedDelegation);
    changeStep(5);
  } catch (error) {
    console.error("Error creating delegation:", error);
  }
  };

  return (
    <button className="button" onClick={handleCreateDelegation}>
      Create Delegation
    </button>
  );
}
