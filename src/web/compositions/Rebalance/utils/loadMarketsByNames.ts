import { Market } from '@project-serum/serum'
import { Connection, PublicKey } from '@solana/web3.js'

import { getTokenMintAddressByName, MarketsMap } from '@sb/dexUtils/markets'
import { notifyForDevelop, notifyWithLog } from '@sb/dexUtils/notifications'
import { notEmpty, onlyUnique } from '@sb/dexUtils/utils'

import { loadMintsDecimalsInfo } from './loadMintsDecimalsInfo'

export interface LoadedMarket {
  market: Market
  marketName: string
}
export type LoadedMarketsMap = Map<string, LoadedMarket>

export const loadMarketsByNames = async ({
  connection,
  marketsNames,
  allMarketsMap,
}: {
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
}): Promise<LoadedMarketsMap> => {
  console.time('markets')

  const marketsMap: LoadedMarketsMap = new Map()

  const filteredMarkets = [...new Set(marketsNames)].map((name) => ({
    address: allMarketsMap.get(name)?.address.toString(),
    name,
  }))

  const filteredMarketIds = filteredMarkets.map((market) => market.address)

  const mints = marketsNames
    .flatMap((name) => {
      const [base, quote] = name.split('_')
      return [base, quote]
    })
    .filter(onlyUnique)
    .map((tokenName) => getTokenMintAddressByName(tokenName))
    .filter(notEmpty)

  const [mintsMap, loadedMarkets] = await Promise.all([
    loadMintsDecimalsInfo({ connection, mints }),
    connection._rpcRequest('getMultipleAccounts', [
      filteredMarketIds,
      { encoding: 'base64' },
    ]),
  ])

  if (loadedMarkets.result.error || !loadedMarkets.result.value) {
    notifyWithLog({
      message:
        'Something went wrong while loading markets, please try again later.',
      result: loadedMarkets.result,
    })

    return marketsMap
  }

  loadedMarkets.result.value.forEach((encodedMarket, index) => {
    const arrayFromBase64 = new Buffer(encodedMarket.data[0], 'base64')

    const decoded = Market.getLayout(new PublicKey(encodedMarket.owner)).decode(
      arrayFromBase64
    )

    if (
      !decoded ||
      !decoded.accountFlags.initialized ||
      !decoded.accountFlags.market ||
      !decoded.baseMint
    ) {
      notifyForDevelop({ message: 'Market decoded incorrectly.', decoded })
      return
    }

    // get base & quote spl sizes from mints
    const { decimals: baseNumberOfDecimals } = mintsMap.get(
      decoded.baseMint?.toString()
    ) || { decimals: null }

    const { decimals: quoteNumberOfDecimals } = mintsMap.get(
      decoded.quoteMint?.toString()
    ) || { decimals: null }

    if (!baseNumberOfDecimals || !quoteNumberOfDecimals) {
      notifyForDevelop({
        message: 'No decimals info.',
        decoded,
        baseMint: decoded.baseMint.toString(),
        quoteMint: decoded.quoteMint.toString(),
        baseNumberOfDecimals,
        quoteNumberOfDecimals,
      })

      return
    }

    const market = new Market(
      decoded,
      baseNumberOfDecimals,
      quoteNumberOfDecimals,
      {},
      new PublicKey(encodedMarket.owner)
    )

    const { name } = filteredMarkets[index]

    if (!name) {
      notifyForDevelop({
        message: 'No name for loaded market.',
        market,
      })

      return
    }

    marketsMap.set(name, { market, marketName: name })
  })

  console.timeEnd('markets')

  return marketsMap
}
