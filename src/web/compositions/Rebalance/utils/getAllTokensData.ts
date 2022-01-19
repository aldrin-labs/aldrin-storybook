import { TokenInstructions } from '@project-serum/serum'

import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'
import { TokenInfo } from '../Rebalance.types'

export const getAllTokensData = async (
  owner: PublicKey,
  connection: Connection
): Promise<TokenInfo[]> => {
  const [parsedTokenAccounts, solBalance] = await Promise.all([
    connection.getParsedTokenAccountsByOwner(owner, {
      programId: TokenInstructions.TOKEN_PROGRAM_ID,
    }),
    connection.getBalance(owner),
  ])

  const SOLToken = {
    symbol: 'SOL',
    amount: solBalance / LAMPORTS_PER_SOL,
    decimals: 9,
    mint: TokenInstructions.WRAPPED_SOL_MINT.toString(),
    address: owner.toString(),
  }

  const parsedTokensData = parsedTokenAccounts.value.map((el) => {
    const symbol = ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
      ? ALL_TOKENS_MINTS_MAP[el.account.data.parsed.info.mint]
      : el.account.data.parsed.info.mint

    return {
      symbol,
      decimals: el.account.data.parsed.info.tokenAmount.decimals,
      amount: el.account.data.parsed.info.tokenAmount.uiAmount,
      mint: el.account.data.parsed.info.mint,
      address: el.pubkey.toString(),
    }
  })

  const allTokensData = [SOLToken, ...parsedTokensData]

  return allTokensData
}
