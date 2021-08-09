import { Account, Connection, PublicKey, Transaction } from "@solana/web3.js"
import { WalletAdapter } from "./adapters"
import { Token } from "./token/token"
import { sendAndConfirmTransactionViaWallet } from "./token/utils/send-and-confirm-transaction-via-wallet"
import { TOKEN_PROGRAM_ID } from "./tokens"

export const createTokens = async ({
  wallet,
  connection,
  mints,
}: {
  wallet: WalletAdapter
  connection: Connection
  mints: PublicKey[]
}) => {
  const transactions = new Transaction()
  const tokenAccounts: Account[] = []

  const addToken = async (mint: PublicKey) => {
    const token = new Token(wallet, connection, mint, TOKEN_PROGRAM_ID)

    // todo: assoc here
    const [_, tokenAccount, transaction] = await token.createAccount(
      wallet.publicKey
    )

    transactions.add(transaction)
    tokenAccounts.push(tokenAccount)

    return { transaction, tokenAccount }
  }

  await Promise.all(mints.map((mint) => addToken(mint)))

  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    transactions,
    ...tokenAccounts
  )
}