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
  baseTokenAmount,
  quoteTokenAmount,
  lpTokenWalletMint,
  lpTokensToBurn,
}: {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  pool: Pool
  userTokenAccountA: string
  userTokenAccountB: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
  baseTokenAmount: number
  quoteTokenAmount: number
  lpTokenWalletMint: string
  lpTokensToBurn: number
}) => {
  const walletWithPk = walletAdapterToWallet(wallet)

  const redeemLiquidityTransaction = await createRedeemLiquidityTransaction({
    wallet: walletWithPk,
    connection,
    pool,
    userTokenAccountA,
    userTokenAccountB,
    baseTokenDecimals,
    quoteTokenDecimals,
    baseTokenAmount,
    quoteTokenAmount,
    lpTokenWalletMint,
    lpTokensToBurn,
  })

  const tx = buildTransactions(
    redeemLiquidityTransaction.instructions.map((instruction) => ({
      instruction,
    })),
    wallet.publicKey,
    []
  )

  const result = await signAndSendTransactions({
    transactionsAndSigners: tx,
    wallet: walletWithPk,
    connection,
  })

  return result
}
