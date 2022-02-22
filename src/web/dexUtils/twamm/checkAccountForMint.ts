import { TokenInstructions } from '@project-serum/serum'
import { Connection, PublicKey } from '@solana/web3.js'

import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { WalletAdapter } from '@sb/dexUtils/types'

export const checkAccountForMint = async ({
  wallet,
  connection,
  mint,
  create,
}: {
  wallet: WalletAdapter
  connection: Connection
  mint: PublicKey
  create: boolean
}) => {
  try {
    const token = new Token(wallet, connection, mint, TOKEN_PROGRAM_ID)

    const resAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TokenInstructions.TOKEN_PROGRAM_ID,
      }
    )

    let tokenWallet = resAccounts.value.find(
      (account) => account.account.data.parsed.info.mint === mint.toString()
    )?.pubkey

    if (create && !tokenWallet) {
      const [newTokenWallet] = await token.createAccount(wallet.publicKey)

      tokenWallet = newTokenWallet
    }

    return tokenWallet
  } catch (e) {
    console.warn('Unable to get tokenaccount for mint:', mint.toString())
    return undefined
  }
}
