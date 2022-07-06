import { ProgramAccount } from 'anchor024'
import useSWR from 'swr'

import {
  walletAdapterToWallet,
  loadFarmerAccountsData,
  Farmer,
} from '@core/solana'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

const NO_DATA = new Map<string, ProgramAccount<Farmer>>()
export const useFarmersAccountInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return NO_DATA
    }

    const walletWithPk = walletAdapterToWallet(wallet)

    const accountInfo = await loadFarmerAccountsData({
      connection,
      wallet: walletWithPk,
    })
    return toMap(accountInfo, (acc) => acc.account.farm.toString())
  }

  return useSWR(`farmers-account-info-${wallet.publicKey?.toString()}`, fetcher) // .data
}
