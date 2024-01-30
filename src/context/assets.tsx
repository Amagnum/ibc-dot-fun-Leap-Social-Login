import { Asset, FeeAsset } from "@skip-router/core";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from "react";

import { useChains } from "@/hooks/useChains";
import { sortFeeAssets } from "@/utils/chain";

import { isAssetWithMetadata, useAssets as useSolveAssets, useSkipClient } from "../solve";

interface AssetsContext {
  assets: Record<string, Asset[]>;
  assetsByChainID: (chainID?: string) => Asset[];
  getAsset(denom: string, chainID: string): Asset | undefined;
  getFeeAsset(chainID: string): Promise<Asset | undefined>;
  getNativeAssets(): Asset[];
  isReady: boolean;
}

export const AssetsContext = createContext<AssetsContext>({
  assets: {},
  assetsByChainID: () => [],
  getAsset: () => undefined,
  getFeeAsset: async () => undefined,
  getNativeAssets: () => [],
  isReady: false,
});

export function AssetsProvider({ children }: { children: ReactNode }) {
  const skipClient = useSkipClient();

  const { data: chains } = useChains();
  const { data: solveAssets } = useSolveAssets();

  const assets = useMemo(() => {
    const data: Record<string, Asset[]> = {};

    if (!solveAssets || !chains) return data;

    for (const [chainID, assets] of Object.entries(solveAssets)) {
      data[chainID] = assets.filter(isAssetWithMetadata);
    }

    return data;
  }, [chains, solveAssets]);

  const assetsByChainID: AssetsContext["assetsByChainID"] = useCallback(
    (chainID?: string) => {
      const chainAssets = chainID ? assets[chainID] || [] : [];
      return /* console.log(chainAssets), */ chainAssets;
    },
    [assets],
  );

  const getAsset = useCallback(
    (denom: string, chainID: string) => {
      const asset = assets[chainID]?.find((asset) => asset.denom === denom);
      return asset;
    },
    [assets],
  );

  const getFeeAsset = useCallback(
    async (chainID: string) => {
      const cached = feeAssetCache[chainID];
      if (cached) return cached;

      let feeAsset: FeeAsset | undefined;
      feeAsset = await skipClient.getFeeInfoForChain(chainID);

      if (!feeAsset) {
        const chain = (chains ?? []).find((chain) => chain.chainID === chainID);
        chain?.feeAssets && ([feeAsset] = chain.feeAssets.sort(sortFeeAssets));
      }

      const asset = feeAsset && getAsset(feeAsset.denom, chainID);
      if (!asset) return;

      return (feeAssetCache[chainID] = asset), asset;
    },
    [chains, getAsset, skipClient],
  );

  const getNativeAssets = useCallback(() => {
    const nativeAssets: Asset[] = [];

    for (const chainAssetList of Object.values(assets)) {
      for (const asset of chainAssetList) {
        if (asset.chainID === asset.originChainID) {
          nativeAssets.push(asset);
        }
      }
    }

    return nativeAssets;
  }, [assets]);

  const isReady = useMemo(() => Object.keys(assets).length > 0, [assets]);

  useEffect(() => {
    if (!isReady || !chains || !assets) return;
    const load = (src: string) => {
      const img = new Image();
      img.src = src;
      img.onload = () => img.remove();
    };
    chains.forEach(({ chainID, logoURI }) => {
      logoURI && load(logoURI);
      (assets[chainID] || []).forEach(({ logoURI }) => {
        logoURI && load(logoURI);
      });
    });
  }, [assets, chains, isReady]);

  return (
    <AssetsContext.Provider
      value={{
        assets,
        assetsByChainID,
        getAsset,
        getFeeAsset,
        getNativeAssets,
        isReady,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets() {
  return useContext(AssetsContext);
}

const feeAssetCache: Record<string, Asset> = {};
