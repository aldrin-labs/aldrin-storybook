import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { isTransactionFailed } from '@sb/dexUtils/send'

import {
  AldrinConnection,
  buildAddTwammOrderTransaction,
  TwammOrderArray,
} from '@core/solana'

import { walletAdapterToWallet } from '../common'
import { signAndSendSingleTransaction } from '../transactions'
import { TokenInfo, WalletAdapter } from '../types'
import { PairSettings } from './types'

export const addOrder = async ({
  wallet,
  connection,
  amount,
  timeLength,
  pairSettings,
  mintFrom,
  mintTo,
  orderArray,
  side,
  allTokensData,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  programAddress?: string
  amount: BN
  timeLength: BN
  pairSettings: PairSettings
  mintFrom: PublicKey
  mintTo: PublicKey
  orders: PublicKey[]
  orderArray: TwammOrderArray[]
  side: 'bid' | 'ask'
  allTokensData: TokenInfo[]
}) => {
  const w = walletAdapterToWallet(wallet)
  const { transaction, signers } = await buildAddTwammOrderTransaction({
    wallet: w,
    connection,
    amount,
    timeLength,
    pairSettings,
    mintFrom,
    mintTo,
    orderArray,
    side,
    allTokensData,
  })
  try {
    const tx = await signAndSendSingleTransaction({
      transaction,
      wallet: w,
      signers,
      connection,
      focusPopup: true,
    })

    if (!isTransactionFailed(tx) && tx !== 'cancelled') {
      return 'success'
    }
  } catch (e) {
    console.log('add order catch error', e)
    if (e.message.includes('cancelled')) {
      return 'cancelled'
    }
  }

  return 'failed'
}
