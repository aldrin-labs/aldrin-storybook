import { TokenInstructions } from '@project-serum/serum'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

type Token = {
  symbol: string
  amount: number
  decimals: number
  mint: string
}

export const getAllTokensData = async (
  owner: PublicKey,
  connection: Connection
): Promise<Token[]> => {
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    owner,
    { programId: TokenInstructions.TOKEN_PROGRAM_ID }
  )
  const solBalance = (await connection.getBalance(owner)) / LAMPORTS_PER_SOL
  const SOLToken = {
    symbol: 'SOL',
    amount: solBalance,
    decimals: 8,
    mint: TokenInstructions.WRAPPED_SOL_MINT,
  }

  const parsedTokensData = parsedTokenAccounts.value.map((el) => ({
    symbol: ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
      ? ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
      : el.account.data.parsed.info.mint,
    decimals: el.account.data.parsed.info.tokenAmount.decimals,
    amount: el.account.data.parsed.info.tokenAmount.uiAmount,
    mint: el.account.data.parsed.info.mint,
  }))

  const allTokensData = [SOLToken, ...parsedTokensData]

  return allTokensData
}
