import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import { FC, Fragment, useState } from "react";
import { useRef, useEffect } from 'react'

import { useChains } from "@/context/chains";

import AssetInput from "../AssetInput";
import { ConnectedWalletButton } from "../ConnectedWalletButton";
import { ConnectWalletButtonSmall } from "../ConnectWalletButtonSmall";
import TransactionDialog from "../TransactionDialog";
import { useWalletModal, WalletModal } from "../WalletModal";
import { useSwapWidget } from "./useSwapWidget";
import { AccountModal, defaultBlurs, defaultBorderRadii } from "@leapwallet/embedded-wallet-sdk-react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";


const RouteLoading = () => (
  <div className="bg-black text-white/50 font-medium uppercase text-xs p-3 rounded-md flex items-center w-full text-left">
    <p className="flex-1">Finding best route...</p>
    <svg
      className="animate-spin h-4 w-4 inline-block text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

const RouteTransactionCountBanner: FC<{
  numberOfTransactions: number;
}> = ({ numberOfTransactions }) => (
  <div className="bg-black text-white/50 font-medium uppercase text-xs p-3 rounded-md flex items-center w-full text-left">
    <p className="flex-1">
      This route requires{" "}
      {numberOfTransactions === 1 && (
        <span className="text-white">1 Transaction</span>
      )}
      {numberOfTransactions > 1 && (
        <span className="text-white">{numberOfTransactions} Transactions</span>
      )}{" "}
      to complete
    </p>
  </div>
);

export const SwapWidget: FC = () => {
  const { openWalletModal } = useWalletModal();
  const { chains } = useChains();

  const {
    amountIn,
    amountOut,
    formValues,
    setFormValues,
    sourceAsset,
    sourceChain,
    destinationAsset,
    destinationChain,
    routeLoading,
    numberOfTransactions,
    route,
    insufficientBalance,
    onSourceChainChange,
    onSourceAssetChange,
    onDestinationChainChange,
    onDestinationAssetChange,
  } = useSwapWidget();

  const {
    status: walletConnectStatus,
    address,
    wallet,
    chain,
  } = useChain(sourceChain?.record?.chain.chain_name ?? "cosmoshub");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const restURL = chain?.apis?.rest?[0] && chain?.apis?.rest[0].address : '' ;
  const chainId = chain?.chain_id || 'comosHub';
  const ClientAccountModal = () => {
      const ref = useRef()
      const [mounted, setMounted] = useState(false)

      useEffect(() => {
        ref.current = document.querySelector("body") as unknown as undefined;
        console.log(document.querySelector("body"))
        setMounted(true)
      }, [])

      const theme = {
        colors: {
          primary: "#fc480a00",
          border: "#E8E8E8",
          stepBorder: "#E8E8E8",
          backgroundPrimary: "#ffffff",
          backgroundSecondary: "#F4F4F4",
          text: "#000000",
          textSecondary: "#858585",
          gray: "#9ca3af",
          alpha: "#ffffff",
          error: "#420006",
          errorBackground: "#FFEBED",
          success: "#29A874",
          successBackground: "#DAF6EB",
        },
        borderRadii: defaultBorderRadii,
        blurs: defaultBlurs,
        fontFamily: "inherit",
      };


      return (mounted && isModalOpen) ? 
                    <AccountModal
                      theme={theme}
                      chainId={chainId}
                      restUrl={restURL}
                      address={address || ''}
                      isOpen={isModalOpen}
                      onClose={()=>{ setIsModalOpen(false) }}
                    /> : null
}

  return (
    <Fragment>
      <div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-2xl">From</p>
            <ClientAccountModal />
            {address &&
            wallet &&
            walletConnectStatus === WalletStatus.Connected ? (
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  <InformationCircleIcon className="w-6 h-6" />
                </button>
                <ConnectedWalletButton
                  address={address}
                  onClick={openWalletModal}
                  walletName={wallet.prettyName}
                  walletLogo={
                    wallet.logo
                      ? typeof wallet.logo === "string"
                        ? wallet.logo
                        : wallet.logo.major
                      : ""
                  }
                />
              </div>
            ) : (
              <ConnectWalletButtonSmall onClick={openWalletModal} />
            )}
          </div>
          <div data-testid="source">
            <AssetInput
              amount={amountIn}
              onAmountChange={(amount) =>
                setFormValues({
                  ...formValues,
                  amountIn: amount,
                })
              }
              asset={sourceAsset}
              onAssetChange={onSourceAssetChange}
              chain={sourceChain}
              onChainChange={onSourceChainChange}
              showBalance
              chains={chains}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="bg-black text-white w-10 h-10 rounded-md flex items-center justify-center z-10 hover:scale-110 transition-transform"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    sourceChain: destinationChain,
                    sourceAsset: destinationAsset,
                    destinationChain: sourceChain,
                    destinationAsset: sourceAsset,
                    amountIn: "",
                  });
                }}
                data-testid="swap-button"
              >
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="font-semibold text-2xl">To</p>
          </div>
          <div data-testid="destination">
            <AssetInput
              amount={amountOut}
              asset={destinationAsset}
              onAssetChange={onDestinationAssetChange}
              chain={destinationChain}
              onChainChange={onDestinationChainChange}
              chains={chains}
            />
          </div>
          {routeLoading && <RouteLoading />}
          {route && !routeLoading && (
            <RouteTransactionCountBanner
              numberOfTransactions={numberOfTransactions}
            />
          )}
          {sourceChain && walletConnectStatus !== WalletStatus.Connected && (
            <button
              className="bg-[#FF486E] text-white font-semibold py-4 rounded-md w-full transition-transform hover:scale-105 hover:rotate-1"
              onClick={async () => {
                openWalletModal();
              }}
            >
              Connect Wallet
            </button>
          )}
          {sourceChain && walletConnectStatus === WalletStatus.Connected && (
            <div className="space-y-4">
              <TransactionDialog
                route={route}
                transactionCount={numberOfTransactions}
                insufficientBalance={insufficientBalance}
              />
              {insufficientBalance && (
                <p className="text-center font-semibold text-sm text-red-500">
                  Insufficient Balance
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <WalletModal chainID={sourceChain?.chainID ?? "cosmoshub-4"} />
    </Fragment>
  );
};
