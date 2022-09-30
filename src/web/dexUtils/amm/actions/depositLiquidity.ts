import { signAndSendTransactions } from '@sb/dexUtils/transactions'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  buildTransactions,
  walletAdapterToWallet,
} from '@core/solana'
import { createDepositLiquidityInstructions } from '@core/solana/programs/amm/instructions/depositLiquidityTransaction'

import { Pool } from '../types'

export const depositLiquidity = async ({
  wallet,
  connection,
  pool,
  userTokenAccountA,
  userTokenAccountB,
  baseTokenDecimals,
  quoteTokenDecimals,
  baseAmount,
  quoteAmount,
}: {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  pool: Pool
  userTokenAccountA: string
  userTokenAccountB: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
  baseAmount: number
  quoteAmount: number
}) => {
  const walletWithPk = walletAdapterToWallet(wallet)

  const depositLiquidityTransaction = await createDepositLiquidityInstructions({
    wallet: walletWithPk,
    connection,
    pool,
    userTokenAccountA,
    userTokenAccountB,
    baseTokenDecimals,
    quoteTokenDecimals,
    baseAmount,
    quoteAmount,
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
