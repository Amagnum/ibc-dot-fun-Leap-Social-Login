import { AccountData } from "@cosmjs/amino";
import { DirectSignResponse, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { DirectSignDoc } from "@cosmos-kit/core";
import Capsule from "@usecapsule/web-sdk";

import { getKey, requestSignature } from "./capsuleConnector";

export class cosmjsOfflineSigner implements OfflineDirectSigner {
  constructor(private chainId: string, private capsule: Capsule) {}

  async getAccounts(): Promise<AccountData[]> {
    const key = await getKey(this.capsule, this.chainId);
    return [
      {
        address: key.address,
        algo: "secp256k1",
        pubkey: key.pubkey,
      },
    ];
  }

  async signDirect(
    signerAddress: string,
    signDoc: DirectSignDoc
  ): Promise<DirectSignResponse> {
    if (this.chainId !== signDoc.chainId) {
      throw new Error("Chain ID does not match signer chain ID");
    }
    const accounts = await this.getAccounts();
    console.log("logging accounts", accounts);

    if (accounts.find((account) => account.address !== signerAddress)) {
      throw new Error("Signer address does not match wallet address");
    }

    return requestSignature(
      this.capsule,
      this.chainId,
      signerAddress,
      signDoc
    ) as unknown as Promise<DirectSignResponse>;
  }

  //This has been added as a placeholder.
  // async signAmino(
  //   signerAddress: string,
  //   signDoc: SignDoc
  // ): Promise<AminoSignResponse> {
  //   return this.signDirect(
  //     signerAddress,
  //     signDoc
  //   ) as unknown as Promise<AminoSignResponse>;
  // }
}

export function getOfflineSigner(chainId: string, capsule: Capsule) {
  return new cosmjsOfflineSigner(chainId, capsule);
}
