import { PublicKey } from '@solana/web3.js'

import { MarketsMap } from '@sb/dexUtils/markets'

import { getVaultOwnerAndNonce } from './marketOrderProgram/getVaultOwnerAndNonce'

export type VaultSignersMap = Map<string, PublicKey>

export const loadVaultSignersFromMarkets = ({
  allMarketsMap,
  marketsNames,
}: {
  allMarketsMap: MarketsMap
  marketsNames: string[]
}): VaultSignersMap => {
  const vaultSignersMap = new Map()

  // not actually async
  for (const [marketName, { address }] of allMarketsMap.entries()) {
    if (marketsNames.length === 0 || marketsNames.includes(marketName)) {
      try {
        const [vaultSigner] = getVaultOwnerAndNonce(address)

        vaultSignersMap.set(marketName, vaultSigner)
      } catch (e) {}
    }
  }

  return vaultSignersMap
}
