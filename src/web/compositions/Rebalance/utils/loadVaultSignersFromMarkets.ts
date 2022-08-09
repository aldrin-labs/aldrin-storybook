import { PublicKey } from '@solana/web3.js'

import { marketsMap } from '@sb/dexUtils/markets'

import { getVaultOwnerAndNonce } from './marketOrderProgram/getVaultOwnerAndNonce'

export type VaultSignersMap = Map<string, PublicKey>

export const loadVaultSignersFromMarkets = async ({
  marketsNames,
}: {
  marketsNames: string[]
}): Promise<VaultSignersMap> => {
  const vaultSignersMap = new Map()

  // not actually async
  for (const [marketName, { address }] of marketsMap.entries()) {
    if (marketsNames.length === 0 || marketsNames.includes(marketName)) {
      try {
        const [vaultSigner] = await getVaultOwnerAndNonce(
          new PublicKey(address)
        )

        vaultSignersMap.set(marketName, vaultSigner)
      } catch (e) {}
    }
  }

  return vaultSignersMap
}
