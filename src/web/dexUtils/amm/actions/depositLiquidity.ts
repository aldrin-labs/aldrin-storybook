import { signAndSendTransactions } from '@sb/dexUtils/transactions'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  buildTransactions,
  walletAdapterToWallet,
} from '@core/solana'
import { createDepositLiquidityInstructions } from '@core/solana/programs/amm/instructions/depositLiquidityTransaction'

export const depositLiquidity = async ({
  wallet,
  connection,
  pool,
}: {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  pool: any // TODO
}) => {
  const walletWithPk = walletAdapterToWallet(wallet)

  const depositLiquidityTransaction = await createDepositLiquidityInstructions({
    wallet: walletWithPk,
    connection,
    pool,
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
