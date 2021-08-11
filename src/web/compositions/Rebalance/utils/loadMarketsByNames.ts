import { sleep } from '@core/utils/helpers'
import { Market, OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { getVaultOwnerAndNonce } from './marketOrderProgram/getVaultOwnerAndNonce'

export interface LoadedMarket {
  market: Market
  vaultSigner: PublicKey | BN
  openOrders: OpenOrders[]
}
export interface LoadedMarketsMap {
  [key: string]: LoadedMarket
}

export const loadMarketsByNames = async ({
  wallet,
  connection,
  marketsNames,
  allMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
}): Promise<LoadedMarketsMap> => {
  const marketsMap: LoadedMarketsMap = {}
  let i = 0

  const filteredMarketNames = [...new Set(marketsNames)]

  console.time('markets')

  for (let name of filteredMarketNames) {
    const marketInfo = allMarketsMap.get(name)

    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    )

    const [vaultSigner] = await getVaultOwnerAndNonce(
      market._decoded.ownAddress
    )

    const openOrders = await market.findOpenOrdersAccountsForOwner(
      connection,
      wallet.publicKey
    )

    marketsMap[name] = { market, vaultSigner, openOrders }

    if (i % 2 === 0) sleep(1 * 1000)

    i++
  }

  console.timeEnd('markets')

  return marketsMap
}
