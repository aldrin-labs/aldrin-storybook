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
  const token = new Token(wallet, connection, mint, TOKEN_PROGRAM_ID)

  let tokenWallet = null
  const tokenAccounts = connection
    .getParsedTokenAccountsByOwner(wallet.publicKey, {
      programId: TokenInstructions.TOKEN_PROGRAM_ID,
    })
    .then((resAccounts) => {
      console.log(resAccounts, 'getParsedTokenAccountsByOwner')
      tokenWallet = resAccounts.value.find((account) => {
        if (account.account.data.parsed.info.mint === mint.toString()) {
          return account.pubkey
        }
      })

      if (create && (!tokenWallet || typeof tokenWallet === 'undefined')) {
        token
          .createAccount(wallet.publicKey)
          .then((resCreateAccount) => {
            console.log(resCreateAccount, 'createAccount')

            connection
              .getAccountInfo(resCreateAccount[0])
              .then((resAccountInfo) =>
                console.log(resAccountInfo, 'accountInfo')
              )
              .catch((error) => console.log(error, 'accountInfoError'))
            tokenWallet = resCreateAccount[0]
            return tokenWallet
          })
          .catch((error) => console.log(error))
      }
      console.log(tokenWallet)
      return tokenWallet.pubkey
    })
    .catch((error) => {
      console.log('error')
    })

  return await tokenAccounts
}
