import 'react-loading-skeleton/dist/skeleton.css'

import { useCallback, useEffect } from 'react'
import { capsule } from 'leap-cosmos-capsule/snap'
import { useSetRecoilState } from 'recoil'
import { userApprovedPromptsState } from 'atoms/login'
import { accountsState } from 'hooks/wallet/useGetAccounts'
import { useChain, useWallet, useWalletClient } from '@cosmos-kit/react'
import {
  totalWalletBalanceState,
  totalStakedBalanceState,
  totalRewardsBalanceState,
} from 'atoms/balances'
import { allNFTsState, allNFTsSearchedAddressState } from 'atoms/nfts'
import { useAuth } from 'context/auth-context'

export default function useAutoRemoveCapsuleWalletState() {
  const setUserApprovedPrompts = useSetRecoilState(userApprovedPromptsState)
  const { client: walletClient } = useWalletClient()
  const { mainWallet: _, mainWallet } = useWallet()

  const { wallet } = useChain('cosmoshub')
  const auth = useAuth()
  const setAccounts = useSetRecoilState(accountsState)
  const setTotalWalletBalance = useSetRecoilState(totalWalletBalanceState)
  const setTotalStakeBalance = useSetRecoilState(totalStakedBalanceState)
  const setTotalRewardsBalance = useSetRecoilState(totalRewardsBalanceState)
  const setAllNFTsList = useSetRecoilState(allNFTsState)
  const setAllNFTsListSearchAddress = useSetRecoilState(allNFTsSearchedAddressState)

  const handleRemoveWallet = useCallback(async () => {
    try {
      const properties = {
        walletName: wallet?.name ?? '',
        // TODO: get the correct value
        walletCount: 1,
      }
      mainWallet?.disconnect()
      walletClient?.disconnect && walletClient?.disconnect()
      setTotalWalletBalance(null)
      setTotalRewardsBalance(null)
      setTotalStakeBalance(null)
      setAllNFTsList(null)
      setAllNFTsListSearchAddress(null)
      setAccounts([])
      setUserApprovedPrompts(false)
      auth && auth.signout()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }, [
    wallet?.name,
    mainWallet,
    walletClient,
    auth,
    setTotalWalletBalance,
    setAllNFTsList,
    setAllNFTsListSearchAddress,
    setTotalRewardsBalance,
    setTotalStakeBalance,
    setAccounts,
    setUserApprovedPrompts,
  ])

  useEffect(() => {
    const fn = async () => {
      if (!(await capsule?.isSessionActive())) {
        handleRemoveWallet()
      }
    }
    fn()
  })

  return
}
