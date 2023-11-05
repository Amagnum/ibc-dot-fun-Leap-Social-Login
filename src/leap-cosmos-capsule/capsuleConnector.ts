// implement capsules
import { AccountData, StdSignDoc } from "@cosmjs/amino";
import { DirectSignDoc } from "@cosmos-kit/core";
import Capsule, {
  CapsuleAminoSigner,
  CapsuleProtoSigner,
} from "@usecapsule/web-sdk";
import Long from "long";


export type SignDoc = {
  /**
   * body_bytes is protobuf serialization of a TxBody that matches the
   * representation in TxRaw.
   */
  bodyBytes: Uint8Array;
  /**
   * auth_info_bytes is a protobuf serialization of an AuthInfo that matches the
   * representation in TxRaw.
   */
  authInfoBytes: Uint8Array;
  /**
   * chain_id is the unique identifier of the chain this transaction targets.
   * It prevents signed transactions from being used on another chain by an
   * attacker
   */
  chainId: string;
  /** account_number is the account number of the account in state */
  accountNumber: Long;
};

// export const capsule = new Capsule(Environment.BETA);

export const chainIdtoAddressPrefix: Record<string, string> = {
  "cosmoshub-4": "cosmos",
  "theta-testnet-001": "cosmos",
  "juno-1": "juno",
  "uni-5": "juno",
  "osmosis-1": "osmo",
  "osmo-test-5": "osmo",
  "secret-4": "secret",
  "pulsar-2": "secret",
  "agoric-3": "agoric",
  "akashnet-2": "akash",
  "archway-1": "archway",
  "constantine-3": "archway",
  "mantle-1": "mantle",
  "axelar-dojo-1": "axelar",
  "axelar-testnet-lisbon-3": "axelar",
  "bitsong-2b": "bitsong",
  "bitcanna-1": "bcna",
  "canto_7700-1": "canto",
  "carbon-1": "swth",
  "perun-1": "c4e",
  "babajaga-1": "c4e",
  "cheqd-mainnet-1": "cheqd",
  "chihuahua-1": "chihuahua",
  "comdex-1": "comdex",
  "coreum-mainnet-1": "core",
  "coreum-testnet-1": "testcore",
  "crescent-1": "cre",
  "crypto-org-chain-mainnet-1": "cro",
  "cudos-1": "cudos",
  "mainnet-3": "decentr",
  "desmos-mainnet": "desmos",
  "dydx-testnet-1": "dydx",
  "emoney-3": "emoney",
  "empowerchain-1": "empower",
  "circulus-1": "empower",
  "evmos_9001-2": "evmos",
  "fetchhub-4": "fetch",
  "gravity-bridge-3": "gravity",
  gitopia: "gitopia",
  "injective-1": "inj",
  "injective-888": "inj",
  "irishub-1": "iaa",
  "ixo-5": "ixo",
  "pandora-8": "ixo",
  "jackal-1": "jkl",
  "kava_2222-10": "kava",
  "kaiyo-1": "kujira",
  "kyve-1": "kyve",
  "kaon-1": "kyve",
  "likecoin-mainnet-2": "like",
  "mars-1": "mars",
  "ares-1": "mars",
  "mayachain-mainnet-v1": "maya",
  "migaloo-1": "migaloo",
  "neutron-1": "neutron",
  "pion-1": "neutron",
  "nibiru-itn-1": "nibi",
  "noble-1": "noble",
  "grand-1": "noble",
  "pirin-1": "nolus",
  "nolus-rila": "nolus",
  "nomic-stakenet-3": "nomic",
  "nomic-testnet-4d": "nomic",
  "omniflixhub-1": "omniflix",
  "onomy-mainnet-1": "onomy",
  "passage-1": "pasg",
  "core-1": "persistence",
  "test-core-1": "persistence",
  "planq_7070-2": "plq",
  "planq_7000-4": "plq",
  "quasar-1": "quasar",
  "qsr-questnet-04": "quasar",
  "quicksilver-2": "quick",
  "atlantic-1": "sei",
  "atlantic-2": "sei",
  "sifchain-1": "sif",
  "sommelier-3": "somm",
  "stargaze-1": "stars",
  "elgafar-1": "stars",
  "iov-mainnet-ibc": "star",
  "stride-1": "stride",
  "teritori-1": "tori",
  "phoenix-1": "terra",
  "umee-1": "umee",
};

/**
 * Get the installed capsules in MetaMask.
 *
 * @returns The capsules installed in MetaMask.
 */

declare global {
  interface window {
    ethereum: unknown;
  }
}

/**
 * Connect a capsule to MetaMask.
 *
 * @param capsuleId - The ID of the capsule.
 * @param params - The params to pass with the capsule to connect.
 */
export const connectCapsule = async (capsule: Capsule) => {
  return new Promise(async (resolve, reject) => {
    const address = Object.values(capsule.getWallets())?.[0]?.address;
    const isSessionActive = await capsule.isSessionActive();
    if (isSessionActive && address) {
      return resolve(true);
    }
    window.successCapsuleModal = () => {
      resolve(true); 
    }
    window.openCapsuleModal(capsule);
  });
};

export const requestAminoSignature = async (
  capsule: Capsule,
  chainId: string,
  signerAddress: string,
  signDoc: StdSignDoc
) => {
  const isConnected = await capsule.isSessionActive();
  if (!isConnected) {
    capsule.refreshSession(true);
    throw new Error("Wallet is not connected, please connect again");
  }

  const wallets = Object.values(capsule.getWallets() ?? {})?.[0];
  const walletSigner = new CapsuleAminoSigner(
    capsule,
    chainIdtoAddressPrefix[chainId],
    wallets?.id
  );
  const signature = await walletSigner.signAmino(signerAddress, signDoc);

  return signature;
};

export const requestSignature = async (
  capsule: Capsule,
  chainId: string,
  signerAddress: string,
  signDoc: DirectSignDoc
) => {
  const isConnected = await capsule.isSessionActive();
  if (!isConnected) {
    capsule.refreshSession(true);
    throw new Error("Wallet is not connected, please connect again");
  }

  const wallets = Object.values(capsule.getWallets() ?? {})?.[0];
  const walletSigner = new CapsuleProtoSigner(
    capsule,
    chainIdtoAddressPrefix[chainId],
    wallets?.id
  );
  const signature = await walletSigner.signDirect(
    signerAddress,
    signDoc as unknown as SignDoc
  );

  const modifiedSignature = {
    signature: signature.signature,
    signed: signature.signed,
  };

  return modifiedSignature;
};

export const getKey = async (
  capsule: Capsule,
  chainId: string
): Promise<AccountData> => {
  console.log(capsule);
  const wallets = Object.values(capsule?.getWallets() ?? {});

  if(wallets.length<1){
    throw Error('Not possible');
  }

  const walletSigner = new CapsuleProtoSigner(
    capsule,
    chainIdtoAddressPrefix[chainId],
    wallets?.[0]?.id
  );
  const accountData = (await walletSigner.getAccounts())[0];

  if (!accountData) throw new Error("No account data found");

  return accountData as AccountData;
};

export const isLocalCapsule = (capsuleId: string) => capsuleId.startsWith("local:");
