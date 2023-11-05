import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";
import Capsule from "@usecapsule/web-sdk";

import { ChainCosmosSnap } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";

export class CosmosCapsuleWallet extends MainWalletBase {
  public capsuleClient: Capsule;
  constructor({walletInfo, capsule}: { walletInfo: Wallet, capsule: Capsule } ) {
    super(walletInfo, ChainCosmosSnap);
    this.capsuleClient = capsule;
  }

  async initClient() {
    this.initingClient();
    try {
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
