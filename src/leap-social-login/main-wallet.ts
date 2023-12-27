import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";

import { ChainCosmosSocial } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";
import { CapsuleEnvironment } from "@leapwallet/cosmos-social-login-capsule-provider";

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

    const CapsuleEnvironment = await import("@leapwallet/cosmos-social-login-capsule-provider").then(
      (CapsuleModule) => {
        const CapsuleProvider = CapsuleModule.CapsuleEnvironment;
        return CapsuleProvider;
      },
    );
    try {
      this.initClientDone(new CosmosCapsuleClient({ loginProvider: new CapsuleProvider({ apiKey: "6831766c031e8f70029411a93002d800", env: "PROD" as CapsuleEnvironment })  } ));
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
