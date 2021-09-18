import { Market } from '@project-serum/serum'
import { getTokenMintAddressByName, MarketsMap } from '@sb/dexUtils/markets'
import {
  notifyForDevelop,
  notifyWithLog,
} from '@sb/dexUtils/notifications'
import { notEmpty, onlyUnique } from '@sb/dexUtils/utils'
import { Connection, PublicKey } from '@solana/web3.js'
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
  allMarketsMapById,
}: {
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
  allMarketsMapById: MarketsMap
}): Promise<LoadedMarketsMap> => {
  const marketsMap: LoadedMarketsMap = new Map()

  const filteredMarketIds = [...new Set(marketsNames)].map((name) =>
    allMarketsMap.get(name)?.address.toString()
  )

  const mints = marketsNames
    .flatMap((name) => {
      const [base, quote] = name.split('_')
      return [base, quote]
    })
    .filter(onlyUnique)
    .map((tokenName) => getTokenMintAddressByName(tokenName))
    .filter(notEmpty)

  const mintsMap = await loadMintsDecimalsInfo({ connection, mints })

  const loadedMarkets = await connection._rpcRequest('getMultipleAccounts', [
    filteredMarketIds,
    { encoding: 'base64' },
  ])

  if (loadedMarkets.result.error || !loadedMarkets.result.value) {
    notifyWithLog({
      message:
        'Something went wrong while loading markets, please try again later.',
      result: loadedMarkets.result,
    })

    return marketsMap
  }

  loadedMarkets.result.value.forEach((encodedMarket) => {
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

    const name = allMarketsMapById.get(market.address.toString())?.name

    if (!name) {
      notifyForDevelop({
        message: 'No name for loaded market.',
        market,
        allMarketsMapById,
      })

      return
    }

    marketsMap.set(name, { market, marketName: name })
  })

  console.timeEnd('markets')

  return marketsMap
}
