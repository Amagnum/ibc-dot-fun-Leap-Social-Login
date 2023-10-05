import { StdSignDoc } from "@cosmjs/amino";
import { Algo, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SignOptions, SignType } from "@cosmos-kit/core";
import { DirectSignDoc, WalletClient } from "@cosmos-kit/core";
import Capsule, { CapsuleAminoSigner } from "@usecapsule/web-sdk";

import { cosmjsOfflineSigner } from "./cosmjs-offline-signer";
import {
  chainIdtoAddressPrefix,
  connectSnap,
  getKey,
  requestAminoSignature,
  requestSignature,
} from "./snap";

export class CosmosCapsuleClient implements WalletClient {
  readonly snapInstalled: boolean = false;
  readonly capsuleClinet;

  constructor(client: Capsule) {
    this.snapInstalled = true;
    this.capsuleClinet = client;
  }

  async enable(chainIds: string | string[]) {
    console.log(chainIds);
    return;
  }

  async disconnect() {
    this.capsuleClinet.logout();
    location.reload();
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username,
    };
  }

  async handleConnect() {
    try {
      await connectSnap(this.capsuleClinet);
    } catch (e) {
      console.error(e);
    }
  }

  async connect() {
    try {
      await connectSnap(this.capsuleClinet);
    } catch (e) {
      console.error(e);
    }
  }

  async getAccount(chainId: string) {
    await this.handleConnect();
    const key = await getKey(this.capsuleClinet, chainId);
    return {
      username: chainId,
      address: key.address,
      algo: key.algo as Algo,
      pubkey: key.pubkey,
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case "amino":
        return this.getOfflineSignerAmino(chainId);
      case "direct":
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }

  getOfflineSignerAmino(chainId: string) {
    const wallets = Object.values(this.capsuleClinet?.getWallets())?.[0];
    return new CapsuleAminoSigner(
      this.capsuleClinet,
      chainIdtoAddressPrefix[chainId],
      wallets?.id,
    );
  }

  getOfflineSignerDirect(chainId: string) {
    return new cosmjsOfflineSigner(
      chainId,
      this.capsuleClinet,
    ) as unknown as OfflineDirectSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions,
  ) {
    console.log(signOptions);
    return requestAminoSignature(this.capsuleClinet, chainId, signer, signDoc);
  }

  async signDirect(chainId: string, signer: string, signDoc: DirectSignDoc) {
    return requestSignature(this.capsuleClinet, chainId, signer, signDoc);
  }
}
