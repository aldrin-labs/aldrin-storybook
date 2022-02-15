import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

import { TokenInfo } from '../../types'

export const findTokenAccount = async (
  userAccounts: TokenInfo[],
  owner: PublicKey,
  mint: string
): Promise<TokenInfo | undefined> => {
  const ata = (
    await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(mint),
      owner
    )
  ).toBase58()

  return (
    userAccounts.find((acc) => acc.address === ata) || // Find associated acc, otherwise - first with the same mint
    userAccounts.find((acc) => acc.mint === mint)
  )
}
