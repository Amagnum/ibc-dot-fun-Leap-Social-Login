import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";

import { ChainCosmosSocial } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";

export class CosmosCapsuleWallet extends MainWalletBase {
  constructor({walletInfo}: { walletInfo: Wallet  } ) {
    super(walletInfo, ChainCosmosSocial);
  }

  async initClient() {
    this.initingClient();
    const CapsuleProvider = await import("@leapwallet/cosmos-social-login-capsule-provider").then(
      (CapsuleModule) => {
        const CapsuleProvider = CapsuleModule.CapsuleProvider;
        return CapsuleProvider;
      },
    );
    try {
      this.initClientDone(new CosmosCapsuleClient({ loginProvider: new CapsuleProvider({ apiKey: "6d8e6cc431a29125a93d8bf95dab7f3f" })  } ));
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
