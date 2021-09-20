import BN from 'bn.js'
import { sleep } from '@core/utils/helpers'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { LoadedMarket, LoadedMarketsMap } from './loadMarketsByNames'
import { getVaultOwnerAndNonce } from './marketOrderProgram/getVaultOwnerAndNonce'

export interface LoadedMarketWithVaultSigner extends LoadedMarket {
  vaultSigner: PublicKey | BN
}
export type LoadedMarketsWithVaultSignersMap = Map<
  string,
  LoadedMarketWithVaultSigner
>

export const loadVaultSignersFromMarkets = async ({
  wallet,
  connection,
  loadedMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
}): Promise<LoadedMarketsWithVaultSignersMap> => {
  const marketsWithSignersMap: LoadedMarketsWithVaultSignersMap = new Map()
  let i = 0

  console.time('vaultSigners')

  for (let marketData of loadedMarketsMap.values()) {
    const { market, marketName } = marketData

    const [vaultSigner] = await getVaultOwnerAndNonce(
      market._decoded.ownAddress
    )

    marketsWithSignersMap.set(marketName, { ...marketData, vaultSigner })

    if (i % 4 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('vaultSigners')

  return marketsWithSignersMap
}
