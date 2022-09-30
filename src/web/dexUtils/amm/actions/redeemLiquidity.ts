import { signAndSendTransactions } from '@sb/dexUtils/transactions'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  buildTransactions,
  walletAdapterToWallet,
} from '@core/solana'
import { createRedeemLiquidityTransaction } from '@core/solana/programs/amm/instructions/redeemLiquidityTransaction'

import { Pool } from '../types'

export const redeemLiquidity = async ({
  wallet,
  connection,
  pool,
  userTokenAccountA,
  userTokenAccountB,
  baseTokenDecimals,
  quoteTokenDecimals,
}: {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  pool: Pool
  userTokenAccountA: string
  userTokenAccountB: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
}) => {
  const walletWithPk = walletAdapterToWallet(wallet)

  const depositLiquidityTransaction = await createRedeemLiquidityTransaction({
    wallet: walletWithPk,
    connection,
    pool,
    userTokenAccountA,
    userTokenAccountB,
    baseTokenDecimals,
    quoteTokenDecimals,
  })

  const tx = buildTransactions(
    depositLiquidityTransaction.instructions.map((instruction) => ({
      instruction,
    })),
    wallet.publicKey,
    depositLiquidityTransaction.signers
  )

  const result = await signAndSendTransactions({
    transactionsAndSigners: tx,
    wallet: walletWithPk,
    connection,
  })

  return result
}
