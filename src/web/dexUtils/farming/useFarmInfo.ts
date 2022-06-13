import useSWR from 'swr'

import {
  Harvest,
  loadFarmAccountsData,
  TokensPerSlotHistory,
  TokensPerSlotValue,
  walletAdapterToWallet,
} from '@core/solana'

import { useConnection } from '../connection'
import { useWallet } from '../wallet'

export const useFarmInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return []
    }
    const walletWithPk = walletAdapterToWallet(wallet)

    const farms = await loadFarmAccountsData({
      connection,
      wallet: walletWithPk,
    })

    const filterTokensPerSlot = ({ value }: { value: TokensPerSlotValue }) =>
      value.amount.gtn(0)

    const filterHarvest = ({
      tokensPerSlot,
    }: {
      tokensPerSlot: TokensPerSlotHistory[]
    }) => tokensPerSlot.filter(filterTokensPerSlot).length > 0

    const removeEmptyTokensPerSlotFromHarvest = (harvest: Harvest) => ({
      ...harvest,
      tokensPerSlot: harvest.tokensPerSlot.filter(filterTokensPerSlot),
    })

    const filteredFarmsHarvests = farms.map((account) => ({
      ...account.account,
      harvests: account.account.harvests
        .filter(filterHarvest)
        .map(removeEmptyTokensPerSlotFromHarvest),
      publicKey: account.publicKey,
    }))

    return filteredFarmsHarvests
  }

  return useSWR(`farm-info-${wallet.publicKey?.toString()}`, fetcher) // .data}
}
