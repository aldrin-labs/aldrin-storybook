import { OpenOrders } from '@project-serum/serum/lib/market'
import { PublicKey } from '@solana/web3.js'

import { LoadedMarket } from './loadMarketsByNames'

export type LoadedMarketWithDataForTransactions = Partial<LoadedMarket> & {
  vaultSigner: PublicKey
  openOrders: OpenOrders[]
}
export type LoadedMarketsWithDataForTransactionsMap = Map<
  string,
  LoadedMarketWithDataForTransactions
>
