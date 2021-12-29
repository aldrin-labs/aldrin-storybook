import { Market } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { Connection } from '@solana/web3.js'

import { WalletAdapter } from '../types'

export interface OrderWithMarket extends Order {
  market: Market
  marketName: string
}

export interface CancelOrderParams {
  order: OrderWithMarket
  wallet: WalletAdapter
  market: Market
  connection: Connection
}
