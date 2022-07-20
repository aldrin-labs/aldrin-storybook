import { getTokenMintAddressByName } from '../markets'
import { notEmpty } from '../utils'

export const getMarketsMintsEdges = (
  marketsNames: string[]
): [string, string][] => {
  // @ts-ignore
  return marketsNames
    .map((marketName) => {
      const [base, quote] = marketName.split('_')
      const baseMint = getTokenMintAddressByName(base)
      const quoteMint = getTokenMintAddressByName(quote)

      if (!baseMint || !quoteMint) return null

      return [baseMint, quoteMint]
    })
    .filter(notEmpty)
}
