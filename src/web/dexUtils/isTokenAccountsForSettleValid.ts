import { Account, Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Market } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/types'
import { notify } from './notifications'

export const isTokenAccountsForSettleValid = async ({
  baseTokenAccount,
  quoteTokenAccount,
  connection,
  wallet,
  market,
}: {
  market: Market
  wallet: WalletAdapter
  connection: Connection
  baseTokenAccount: any
  quoteTokenAccount: any
}): Promise<boolean> => {
  // handling case when user might settle with 11111111111111111111111111111111 instead of the user's pubkey
  if (
    (baseTokenAccount &&
      baseTokenAccount.pubkey &&
      SystemProgram.programId.equals(baseTokenAccount.pubkey)) ||
    (quoteTokenAccount &&
      quoteTokenAccount.pubkey &&
      SystemProgram.programId.equals(quoteTokenAccount.pubkey))
  ) {
    notify({
      message: 'Sorry, your base/quote pubKey related to Solana Program Id.',
    })
    return false
  }

  if (SystemProgram.programId.equals(wallet?.publicKey)) {
    notify({
      message: 'Sorry, your wallet pubKey related to Solana Program Id.',
    })
    return false
  }

  // if (baseTokenAccount?.pubkey) {
  //   const baseToken = new Token(
  //     connection,
  //     new PublicKey(market.baseMintAddress),
  //     TOKEN_PROGRAM_ID,
  //     new Account()
  //   )
  //   const baseTokenInfo = await baseToken.getAccountInfo(
  //     new PublicKey(baseTokenAccount.pubkey)
  //   )

  //   if (
  //     !baseTokenInfo.owner.equals(wallet.publicKey) ||
  //     baseTokenInfo.owner.equals(SystemProgram.programId)
  //   ) {
  //     notify({
  //       message: `Sorry, your wallet pubKey doesn't related to your base tokenAccount owners.`,
  //     })
  //     console.log('baseTokenInfo.owner', baseTokenInfo.owner.toBase58())
  //     return false
  //   }
  // }

  // if (quoteTokenAccount?.pubkey) {
  //   const quoteToken = new Token(
  //     connection,
  //     new PublicKey(market.quoteMintAddress),
  //     TOKEN_PROGRAM_ID,
  //     new Account()
  //   )
  //   const quoteTokenInfo = await quoteToken.getAccountInfo(
  //     new PublicKey(quoteTokenAccount.pubkey)
  //   )

  //   if (
  //     !quoteTokenInfo.owner.equals(wallet.publicKey) ||
  //     quoteTokenInfo.owner.equals(SystemProgram.programId)
  //   ) {
  //     notify({
  //       message: `Sorry, your wallet pubKey doesn't related to your quote tokenAccount owners.`,
  //     })
  //     console.log('quoteTokenInfo.owner', quoteTokenInfo.owner.toBase58())

  //     return false
  //   }
  // }

  return true
}
