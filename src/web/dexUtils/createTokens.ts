import { Connection, PublicKey, Transaction } from '@solana/web3.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { signAndSendTransaction } from './transactions'
import { createAssociatedTokenAccountIx } from './wallet'

export const createTokens = async ({
  wallet,
  connection,
  mints,
}: {
  wallet: WalletAdapter
  connection: Connection
  mints: string[]
}) => {
  const transactions = new Transaction()

  const addToken = async (mint: string) => {
    console.log('mint', mint)
    // todo: assoc here
    const [transaction] = await createAssociatedTokenAccountIx(
      wallet.publicKey,
      wallet.publicKey,
      new PublicKey(mint)
    )

    transactions.add(transaction)

    return { transaction }
  }

  await Promise.all(mints.map((mint) => addToken(mint)))

  await signAndSendTransaction({
    wallet,
    connection,
    transaction: transactions,
    focusPopup: true,
    signers: [],
  })
}
