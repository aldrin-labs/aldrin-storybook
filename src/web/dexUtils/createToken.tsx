import { PublicKey, Connection } from '@solana/web3.js'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Token, TOKEN_PROGRAM_ID } from './token/token'
import { sendAndConfirmTransactionViaWallet } from './token/utils/send-and-confirm-transaction-via-wallet'

export const createToken = async ({
  wallet,
  connection,
  mint,
}: {
  wallet: WalletAdapter
  connection: Connection
  mint: PublicKey
}) => {
  const token = new Token(wallet, connection, mint, TOKEN_PROGRAM_ID)

  const [_, tokenAccount, transaction] = await token.createAccount(
    wallet.publicKey
  )
  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    transaction,
    tokenAccount
  )
}
