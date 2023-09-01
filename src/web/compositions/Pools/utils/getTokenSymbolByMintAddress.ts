import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

export const getTokenSymbolByMintAddress = (mintAddress: string) => {
  if (!mintAddress) {
    throw new Error('No mint address in getTokenSymbolByMintAddress')
  }

  const tokenSymbol = ALL_TOKENS_MINTS_MAP[mintAddress]

  if (!tokenSymbol) {
    return `${mintAddress.slice(0, 3)}...${mintAddress.slice(
      mintAddress.length - 3
    )}`
  }

  return tokenSymbol
}
