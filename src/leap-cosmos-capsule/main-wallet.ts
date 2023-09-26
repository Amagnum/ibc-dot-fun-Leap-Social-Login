import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";
import Capsule from "@usecapsule/web-sdk";

import { ChainCosmosSnap } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";

export class CosmosCapsuleWallet extends MainWalletBase {
  public capsuleClient: Capsule | undefined;
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmosSnap);
  }

  async initClient() {
    this.initingClient();
    try {
      await import("@usecapsule/web-sdk").then((CapsuleModule) => {
        const Capsule = CapsuleModule.default;
        CapsuleModule.Environment;
        const instance = new Capsule(
          CapsuleModule.Environment.BETA,
          undefined,
          {
            offloadMPCComputationURL:
              "https://capsule.leapwallet.io/",
          }
        );
        this.capsuleClient = instance;
      });
      console.log(this.capsuleClient);
      if (!this.capsuleClient) return;
      this.initClientDone(new CosmosCapsuleClient(this.capsuleClient));
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error as Error);
      window.open(
        "https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk",
        "_blank"
      );
    }
  }
}
