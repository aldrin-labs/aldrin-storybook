import { ProgramAccount } from '@project-serum/anchor'
import useSWR from 'swr'

import { fetchSrinStakingAccount, SRinUserAccount } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useSrinStakingAccounts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return new Map<string, ProgramAccount<SRinUserAccount>>()
    }
    const w = walletAdapterToWallet(wallet)
    return fetchSrinStakingAccount(w, connection)
  }

  return useSWR(
    `srin-staking-accounts-${wallet.publicKey?.toString()}`,
    fetcher
  )
}
