import { signAndSendTransactions } from '@sb/dexUtils/transactions'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  buildTransactions,
  walletAdapterToWallet,
} from '@core/solana'
import { createPoolTransaction } from '@core/solana/programs/amm/instructions/createPoolTransaction'

export const createPool = async ({
  wallet,
  connection,
  amplifier,
  tokenMintA,
  tokenMintB,
}: {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  amplifier: number
  tokenMintA: string
  tokenMintB: string
}) => {
  const createPoolInstructions = await createPoolTransaction({
    wallet,
    connection,
    amplifier,
    tokenMintA,
    tokenMintB,
  })

  const walletWithPk = walletAdapterToWallet(wallet)

  const tx = buildTransactions(
    createPoolInstructions.instructions.map((instruction) => ({ instruction })),
    walletWithPk.publicKey,
    createPoolInstructions.signers
  )

  const result = await signAndSendTransactions({
    transactionsAndSigners: tx,
    connection,
    wallet: walletWithPk,
  })

  return result
}
