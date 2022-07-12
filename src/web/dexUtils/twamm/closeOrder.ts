import { WalletAdapter } from '@sb/dexUtils/types'

import {
  buildCloseTwammOrderTransaction,
  AldrinConnection,
  TwammOrderSide,
} from '@core/solana'

import { walletAdapterToWallet } from '../common'
import { signAndSendSingleTransaction } from '../transactions'
import { PairSettings, TwammOrder } from './types'

export const closeOrder = async ({
  wallet,
  connection,
  pairSettings,
  order,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  side,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  pairSettings: PairSettings
  order: TwammOrder
  userBaseTokenAccount: string
  userQuoteTokenAccount: string
  side: TwammOrderSide
}) => {
  const { transaction, signers } = await buildCloseTwammOrderTransaction({
    wallet: walletAdapterToWallet(wallet),
    connection,
    pairSettings,
    order,
    side,
    userBaseTokenAccount,
    userQuoteTokenAccount,
  })

  const result = await signAndSendSingleTransaction({
    wallet: walletAdapterToWallet(wallet),
    connection,
    transaction,
    signers,
  })

  return result
}
