import { useMemo } from 'react'
import {
  Market,
  Orderbook,
  decodeEventQueue,
  TokenInstructions,
  MARKETS,
  TOKEN_MINTS,
  OpenOrders,
} from '@project-serum/serum'
import { PublicKey } from '@solana/web3.js'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalStorageState } from './utils'
import { refreshCache, useAsyncData } from './fetch-loop'
import { useAccountData, useAccountInfo, useConnection } from './connection'
import { useWallet } from './wallet'
import tuple from 'immutable-tuple'
import { notify } from './notifications'
import { BN } from 'bn.js'
import { getTokenAccountInfo } from './tokens'
import { AWESOME_MARKETS, AWESOME_TOKENS } from '@sb/dexUtils/serum'

export const ALL_TOKENS_MINTS = [...TOKEN_MINTS, ...AWESOME_TOKENS]
export const ALL_TOKENS_MINTS_MAP = ALL_TOKENS_MINTS.reduce((acc, el) => {
  acc[el.address] = el.name
  acc[el.name] = el.address

  return acc
}, {})

// const ALL_TOKENS_MINTS_MAP = new Map();

// ALL_TOKENS_MINTS.forEach(tokenMint => {
//   // set address by name and name by address
//   ALL_TOKENS_MINTS_MAP.set(tokenMint.name, tokenMint);
//   ALL_TOKENS_MINTS_MAP.set(tokenMint.address.toString(), tokenMint);
// })

// Used in debugging, should be false in production

const _IGNORE_DEPRECATED = false

const USE_MARKETS = _IGNORE_DEPRECATED
  ? MARKETS.map((m) => ({ ...m, deprecated: false }))
  : [
      {
        address: new PublicKey('7gZNLDbWE73ueAoHuAeFoSu7JqmorwCLpNTBXHtYSFTa'),
        name: 'CCAI/USDC',
        programId: new PublicKey(
          '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
        ),
        deprecated: false,
      },
    ].concat(MARKETS)
// : MARKETS

export const UPDATED_AWESOME_MARKETS = AWESOME_MARKETS.map((el) => ({
  ...el,
  address: el.address.toString(),
  programId: el.programId.toString(),
  isCustomUserMarket: true,
}))

export function useOfficialMarketsList() {
  const OFFICIAL_MARKETS_MAP = new Map()

  const officialMarkets = [...useMarketsList(), ...UPDATED_AWESOME_MARKETS]

  officialMarkets?.forEach((market) =>
    OFFICIAL_MARKETS_MAP.set(market.name.replaceAll('/', '_'), market)
  )

  return OFFICIAL_MARKETS_MAP
}

export function useMarketsList() {
  const UPDATED_USE_MARKETS = USE_MARKETS.filter(
    (el) =>
      !el.deprecated ||
      (el.name.includes('/WUSDT') &&
        el.programId.toBase58() ===
          '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin')
  )

  return UPDATED_USE_MARKETS
}

export function useCustomMarkets() {
  const [customMarkets, setCustomMarkets] = useLocalStorageState(
    'customMarkets',
    []
  )
  return { customMarkets, setCustomMarkets }
}

export function useAllMarkets() {
  const connection = useConnection()
  const { customMarkets } = useCustomMarkets()

  const getAllMarkets = async () => {
    console.log('getAllMarkets', getMarketInfos(customMarkets))
    let i = 0
    const markets: Array<{
      market: Market
      marketName: string
      programId: PublicKey
    } | null> = await Promise.all(
      getMarketInfos(customMarkets).map(async (marketInfo) => {
        try {
          console.log('marketInfo.address', marketInfo.address, ++i)

          const market = await Market.load(
            connection,
            marketInfo.address,
            {},
            marketInfo.programId
          )

          return {
            market,
            marketName: marketInfo.name,
            programId: marketInfo.programId,
          }
        } catch (e) {
          notify({
            message: 'Error loading all market',
            description: e.message,
            type: 'error',
          })
          return null
        }
      })
    )

    console.log('getAllMarkets markets', markets)

    return markets.filter(
      (m): m is { market: Market; marketName: string; programId: PublicKey } =>
        !!m
    )
  }

  const memoizedGetAllMarkets = useMemo(() => getAllMarkets, [
    JSON.stringify(customMarkets),
  ])

  // console.log('memoizedGetAllMarkets', memoizedGetAllMarkets)

  const getAllMarketsResult = useAsyncData(
    memoizedGetAllMarkets,
    tuple('getAllMarkets', customMarkets.length, connection),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )

  return getAllMarketsResult
}

export function useUnmigratedOpenOrdersAccounts() {
  const connection = useConnection()
  const { wallet } = useWallet()

  async function getUnmigratedOpenOrdersAccounts() {
    if (!wallet || !connection || !wallet.publicKey) {
      return []
    }
    console.log('refreshing useUnmigratedOpenOrdersAccounts')
    let deprecatedOpenOrdersAccounts = []
    const deprecatedProgramIds = Array.from(
      new Set(
        USE_MARKETS.filter(
          ({ deprecated }) => deprecated
        ).map(({ programId }) => programId.toBase58())
      )
    ).map((publicKeyStr) => new PublicKey(publicKeyStr))
    let programId
    for (programId of deprecatedProgramIds) {
      try {
        const openOrdersAccounts = await OpenOrders.findForOwner(
          connection,
          wallet.publicKey,
          programId
        )
        deprecatedOpenOrdersAccounts = deprecatedOpenOrdersAccounts.concat(
          openOrdersAccounts
            .filter(
              (openOrders) =>
                openOrders.baseTokenTotal.toNumber() ||
                openOrders.quoteTokenTotal.toNumber()
            )
            .filter((openOrders) =>
              USE_MARKETS.some(
                (market) =>
                  market.deprecated && market.address.equals(openOrders.market)
              )
            )
        )
      } catch (e) {
        console.log(
          'Error loading deprecated markets',
          programId?.toBase58(),
          e.message
        )
      }
    }
    // Maybe sort
    return deprecatedOpenOrdersAccounts
  }

  const cacheKey = tuple(
    'getUnmigratedOpenOrdersAccounts',
    connection,
    wallet?.publicKey?.toBase58()
  )
  const [accounts] = useAsyncData(getUnmigratedOpenOrdersAccounts, cacheKey, {
    refreshInterval: _VERY_SLOW_REFRESH_INTERVAL,
  })

  return {
    accounts,
    refresh: (clearCache) => refreshCache(cacheKey, clearCache),
  }
}

const MarketContext = React.createContext(null)

const _VERY_SLOW_REFRESH_INTERVAL = 5000 * 1000

// For things that don't really change
const _SLOW_REFRESH_INTERVAL = 3 * 1000

// For things that change frequently
const _FAST_REFRESH_INTERVAL = 1 * 1000

export const DEFAULT_MARKET = USE_MARKETS.find(
  ({ name, deprecated }) => name === 'SRM/USDT' && !deprecated
)

function getMarketDetails(market, customMarkets) {
  if (!market) {
    return {}
  }
  const marketInfos = getMarketInfos(customMarkets)
  const marketInfo = marketInfos.find((otherMarket) =>
    otherMarket.address.equals(market.address)
  )
  const baseCurrency =
    (market?.baseMintAddress &&
      ALL_TOKENS_MINTS.find((token) =>
        token.address.equals(market.baseMintAddress)
      )?.name) ||
    (marketInfo?.baseLabel && `${marketInfo?.baseLabel}*`) ||
    'UNKNOWN'
  const quoteCurrency =
    (market?.quoteMintAddress &&
      ALL_TOKENS_MINTS.find((token) =>
        token.address.equals(market.quoteMintAddress)
      )?.name) ||
    (marketInfo?.quoteLabel && `${marketInfo?.quoteLabel}*`) ||
    'UNKNOWN'

  console.log('market data', {
    marketName: marketInfo?.name,
    baseCurrency,
    quoteCurrency,
    marketInfo,
  })

  return {
    ...marketInfo,
    marketName: marketInfo?.name,
    baseCurrency,
    quoteCurrency,
    marketInfo,
  }
}

const getPairFromLocation = () => {
  let pair = 'CCAI_USDC'
  const { pathname } = location

  const isChartPage = pathname.includes('chart')
  const pairInChartUrl = pathname.split('/')[3]

  const isAnalytics = pathname.includes('analytics')
  const pairInAnalyticsUrl = pathname.split('/')[2]

  if (isChartPage && pairInChartUrl) {
    pair = pairInChartUrl
  } else if (
    isAnalytics &&
    pairInAnalyticsUrl &&
    pairInAnalyticsUrl !== 'all'
  ) {
    pair = pairInAnalyticsUrl
  }

  // we have pairs in format base/quote in array
  return pair.replace('_', '/')
}

export function MarketProvider({ children }) {
  const [customMarkets, setCustomMarkets] = useLocalStorageState(
    'customMarkets',
    []
  )

  const marketName = getPairFromLocation()
  const connection = useConnection()
  const marketInfos = getMarketInfos(customMarkets)

  // here we try to get non deprecated one
  let marketInfo = marketInfos.find(
    (market) => market.name === marketName && !market.deprecated
  )

  if (!marketInfo) {
    marketInfo = marketInfos.find((market) => market.name === marketName)
  }

  const [market, setMarket] = useState()
  // add state for markets
  // add useEffect for customMarkets
  useEffect(() => {
    if (
      market &&
      marketInfo &&
      market._decoded.ownAddress?.equals(marketInfo?.address)
    ) {
      console.log('useEffect in market - first return')
      return
    }

    setMarket(null)

    if (!marketInfo || !marketInfo?.address) {
      notify({
        message: 'Error loading market',
        description: 'Please select a market from the dropdown',
        type: 'error',
      })
      return
    }

    // console.log('useEffect in market - load market')
    Market.load(connection, marketInfo.address, {}, marketInfo.programId)
      .then((data) => {
        console.log(
          'useEffect in market - set market in load',
          marketInfo.address,
          marketInfo.name,
          data
        )
        return setMarket(data)
      })
      .catch((e) =>
        notify({
          message: 'Error loading market',
          description: e.message,
          type: 'error',
        })
      )
    // eslint-disable-next-line
  }, [connection, marketInfo])

  const marketData = getMarketDetails(market, customMarkets)

  // console.log('marketData', market, marketInfo, marketData)

  return (
    <MarketContext.Provider
      value={{
        market,
        ...marketData,
        customMarkets,
        setCustomMarkets,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  return useContext(MarketContext)
}

export function useMarkPrice() {
  const [markPrice, setMarkPrice] = useState(null)

  const [orderbook] = useOrderbook()
  const trades = useTrades()

  useEffect(() => {
    let bb = orderbook?.bids?.length > 0 && Number(orderbook.bids[0][0])
    let ba = orderbook?.asks?.length > 0 && Number(orderbook.asks[0][0])
    let last = trades?.length > 0 && trades[0].price

    let markPrice =
      bb && ba
        ? last
          ? [bb, ba, last].sort((a, b) => a - b)[1]
          : (bb + ba) / 2
        : null

    setMarkPrice(markPrice)
  }, [orderbook, trades])

  return markPrice
}

export function _useUnfilteredTrades(limit = 10000) {
  const { market } = useMarket()
  const connection = useConnection()
  async function getUnfilteredTrades() {
    if (!market || !connection) {
      return null
    }
    return await market.loadFills(connection, limit)
  }
  const [trades] = useAsyncData(
    getUnfilteredTrades,
    tuple('getUnfilteredTrades', market, connection),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
  return trades
  // NOTE: For now, websocket is too expensive since the event queue is large
  // and updates very frequently

  // let data = useAccountData(market && market._decoded.eventQueue);
  // if (!data) {
  //   return null;
  // }
  // const events = decodeEventQueue(data, limit);
  // return events
  //   .filter((event) => event.eventFlags.fill && event.nativeQuantityPaid.gtn(0))
  //   .map(market.parseFillEvent.bind(market));
}

export function useOrderbookAccounts() {
  const { market } = useMarket()
  let bidData = useAccountData(market && market._decoded.bids)
  let askData = useAccountData(market && market._decoded.asks)
  return {
    bidOrderbook: bidData ? Orderbook.decode(market, bidData) : null,
    askOrderbook: askData ? Orderbook.decode(market, askData) : null,
  }
}

export function useOrderbook(depth = 30) {
  const { bidOrderbook, askOrderbook } = useOrderbookAccounts()
  const { market } = useMarket()
  const bids =
    !bidOrderbook || !market
      ? []
      : bidOrderbook.getL2(depth).map(([price, size]) => [price, size])
  const asks =
    !askOrderbook || !market
      ? []
      : askOrderbook.getL2(depth).map(([price, size]) => [price, size])
  return [{ bids, asks }, !!bids || !!asks]
}

// Want the balances table to be fast-updating, dont want open orders to flicker
// TODO: Update to use websocket
export function useOpenOrdersAccounts(fast = false) {
  const { market } = useMarket()
  const { connected, wallet } = useWallet()
  const connection = useConnection()
  async function getOpenOrdersAccounts() {
    if (!connected) {
      return null
    }
    if (!market) {
      return null
    }

    const accounts = await market.findOpenOrdersAccountsForOwner(
      connection,
      wallet.publicKey
    )

    return accounts
  }
  return useAsyncData(
    getOpenOrdersAccounts,
    tuple('getOpenOrdersAccounts', wallet, market, connected),
    { refreshInterval: fast ? _FAST_REFRESH_INTERVAL : _SLOW_REFRESH_INTERVAL }
  )
}

export function useSelectedOpenOrdersAccount(fast = false) {
  const [accounts, loaded] = useOpenOrdersAccounts(fast)

  if (!accounts) {
    return null
  }

  return accounts[0]
}

export function useTokenAccounts() {
  const { connected, wallet } = useWallet()
  const connection = useConnection()

  async function getTokenAccounts() {
    if (!connected) {
      return null
    }
    return await getTokenAccountInfo(connection, wallet.publicKey)
  }

  return useAsyncData(
    getTokenAccounts,
    tuple('getTokenAccounts', wallet, connected),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

export function getSelectedTokenAccountForMint(
  accounts: TokenAccount[] | undefined | null,
  mint: PublicKey | undefined,
  selectedPubKey?: string | PublicKey | null
) {
  if (!accounts || !mint) {
    return null
  }
  const filtered = accounts.filter(
    ({ effectiveMint, pubkey }) =>
      mint.equals(effectiveMint) &&
      (!selectedPubKey ||
        (typeof selectedPubKey === 'string'
          ? selectedPubKey
          : selectedPubKey.toBase58()) === pubkey.toBase58())
  )
  return filtered && filtered[0]
}

export function useSelectedQuoteCurrencyAccount() {
  const [accounts, loaded] = useTokenAccounts()
  const { market } = useMarket()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()

  const mintAddress = market?.quoteMintAddress

  return getSelectedTokenAccountForMint(
    accounts,
    mintAddress,
    mintAddress && selectedTokenAccounts[mintAddress.toBase58()]
  )
}

export function useSelectedBaseCurrencyAccount() {
  const [accounts] = useTokenAccounts()
  const { market } = useMarket()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()

  const mintAddress = market?.baseMintAddress

  return getSelectedTokenAccountForMint(
    accounts,
    mintAddress,
    mintAddress && selectedTokenAccounts[mintAddress.toBase58()]
  )
}

// TODO: Update to use websocket
export function useQuoteCurrencyBalances() {
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount()
  const { market } = useMarket()
  const [accountInfo, loaded, refresh] = useAccountInfo(
    quoteCurrencyAccount?.pubkey
  )
  if (!market || !quoteCurrencyAccount || !loaded) {
    return [null, refresh]
  }
  if (market.quoteMintAddress.equals(TokenInstructions.WRAPPED_SOL_MINT)) {
    return [accountInfo?.lamports / 1e9 ?? 0, refresh]
  }
  return [
    market.quoteSplSizeToNumber(
      new BN(accountInfo.data.slice(64, 72), 10, 'le')
    ),
    refresh,
  ]
}

// TODO: Update to use websocket
export function useBaseCurrencyBalances() {
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount()
  const { market } = useMarket()
  const [accountInfo, loaded, refresh] = useAccountInfo(
    baseCurrencyAccount?.pubkey
  )
  if (!market || !baseCurrencyAccount || !loaded) {
    return [null, refresh]
  }
  if (market.baseMintAddress.equals(TokenInstructions.WRAPPED_SOL_MINT)) {
    return [accountInfo?.lamports / 1e9 ?? 0, refresh]
  }
  return [
    market.baseSplSizeToNumber(
      new BN(accountInfo.data.slice(64, 72), 10, 'le')
    ),
    refresh,
  ]
}

// TODO: Update to use websocket
export function useSelectedQuoteCurrencyBalances() {
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount()
  const { market } = useMarket()
  const [accountInfo, loaded] = useAccountInfo(quoteCurrencyAccount?.pubkey)
  if (!market || !quoteCurrencyAccount || !loaded || !accountInfo) {
    return null
  }
  if (market.quoteMintAddress.equals(TokenInstructions.WRAPPED_SOL_MINT)) {
    return accountInfo?.lamports / 1e9 ?? 0
  }
  return market.quoteSplSizeToNumber(
    new BN(accountInfo.data.slice(64, 72), 10, 'le')
  )
}

// TODO: Update to use websocket
export function useSelectedBaseCurrencyBalances() {
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount()
  const { market } = useMarket()
  const [accountInfo, loaded] = useAccountInfo(baseCurrencyAccount?.pubkey)
  if (!market || !baseCurrencyAccount || !loaded || !accountInfo) {
    return null
  }
  if (market.baseMintAddress.equals(TokenInstructions.WRAPPED_SOL_MINT)) {
    return accountInfo?.lamports / 1e9 ?? 0
  }
  return market.baseSplSizeToNumber(
    new BN(accountInfo.data.slice(64, 72), 10, 'le')
  )
}

export function useOpenOrders() {
  const { market, marketName } = useMarket()
  const [openOrdersAccounts] = useOpenOrdersAccounts(false)
  const { bidOrderbook, askOrderbook } = useOrderbookAccounts()
  if (!market || !openOrdersAccounts || !bidOrderbook || !askOrderbook) {
    return null
  }
  return market
    .filterForOpenOrders(bidOrderbook, askOrderbook, openOrdersAccounts)
    .map((order) => ({ ...order, marketName, market }))
}

export function useTrades(limit = 100) {
  const trades = _useUnfilteredTrades(limit)
  if (!trades) {
    return null
  }
  // Until partial fills are each given their own fill, use maker fills
  return trades
    .filter(({ eventFlags }) => eventFlags.maker)
    .map((trade) => ({
      ...trade,
      side: trade.side === 'buy' ? 'sell' : 'buy',
    }))
}

export function useFeeDiscountKeys() {
  const { market } = useMarket()
  const { connected, wallet } = useWallet()
  const connection = useConnection()
  async function getFeeDiscountKeys() {
    if (!connected) {
      return null
    }
    if (!market) {
      return null
    }
    return await market.findFeeDiscountKeys(connection, wallet.publicKey)
  }
  return useAsyncData(
    getFeeDiscountKeys,
    tuple('getFeeDiscountKeys', wallet, market, connected),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )
}

export function useFills(limit = 100) {
  const { marketName } = useMarket()
  const fills = _useUnfilteredTrades(limit)
  const [openOrdersAccounts] = useOpenOrdersAccounts()
  if (!openOrdersAccounts || openOrdersAccounts.length === 0) {
    return null
  }
  if (!fills) {
    return null
  }
  return fills
    .filter((fill) =>
      openOrdersAccounts.some((openOrdersAccount) =>
        fill.openOrders.equals(openOrdersAccount.publicKey)
      )
    )
    .map((fill) => ({ ...fill, marketName }))
}

// TODO: Update to use websocket
export function useFillsForAllMarkets(limit = 100) {
  const { connected, wallet } = useWallet()

  const connection = useConnection()
  const allMarkets = useAllMarkets()

  async function getFillsForAllMarkets() {
    let fills = []
    if (!connected) {
      return fills
    }

    let marketData
    for (marketData of allMarkets) {
      const { market, marketName } = marketData
      if (!market) {
        return fills
      }
      const openOrdersAccounts = await market.findOpenOrdersAccountsForOwner(
        connection,
        wallet.publicKey
      )
      const openOrdersAccount = openOrdersAccounts && openOrdersAccounts[0]
      if (!openOrdersAccount) {
        return fills
      }
      const eventQueueData = await connection.getAccountInfo(
        market && market._decoded.eventQueue
      )
      let data = eventQueueData?.data
      if (!data) {
        return fills
      }
      const events = decodeEventQueue(data, limit)
      const fillsForMarket = events
        .filter(
          (event) => event.eventFlags.fill && event.nativeQuantityPaid.gtn(0)
        )
        .map(market.parseFillEvent.bind(market))
      const ownFillsForMarket = fillsForMarket
        .filter((fill) => fill.openOrders.equals(openOrdersAccount.publicKey))
        .map((fill) => ({ ...fill, marketName }))
      fills = fills.concat(ownFillsForMarket)
    }

    console.log(JSON.stringify(fills))
    return fills
  }

  return useAsyncData(
    getFillsForAllMarkets,
    tuple('getFillsForAllMarkets', connected, connection, allMarkets, wallet),
    { refreshInterval: _FAST_REFRESH_INTERVAL }
  )
}

// TODO: Update to use websocket
export function useOpenOrdersForAllMarkets() {
  const { connected, wallet } = useWallet()

  const connection = useConnection()
  const allMarkets = useAllMarkets()

  async function getOpenOrdersForAllMarkets() {
    let orders = []
    if (!connected) {
      return orders
    }

    let marketData
    for (marketData of allMarkets) {
      const { market, marketName } = marketData
      if (!market) {
        return orders
      }
      const openOrdersAccounts = await market.findOpenOrdersAccountsForOwner(
        connection,
        wallet.publicKey
      )
      const openOrdersAccount = openOrdersAccounts && openOrdersAccounts[0]
      if (!openOrdersAccount) {
        return orders
      }
      const [bids, asks] = await Promise.all([
        market.loadBids(connection),
        market.loadAsks(connection),
      ])
      const ordersForMarket = [...bids, ...asks]
        .filter((order) => {
          return order.openOrdersAddress.equals(openOrdersAccount.publicKey)
        })
        .map((order) => {
          return { ...order, marketName }
        })
      orders = orders.concat(ordersForMarket)
    }

    return orders
  }

  return useAsyncData(
    getOpenOrdersForAllMarkets,
    tuple(
      'getOpenOrdersForAllMarkets',
      connected,
      connection,
      wallet,
      allMarkets
    ),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

export function useBalances() {
  const { baseCurrency, quoteCurrency, market } = useMarket()

  const [baseCurrencyBalances, refreshBase] = useBaseCurrencyBalances()
  const [quoteCurrencyBalances, refreshQuote] = useQuoteCurrencyBalances()

  const openOrders = useSelectedOpenOrdersAccount(true)

  const baseExists =
    openOrders && openOrders.baseTokenTotal && openOrders.baseTokenFree
  const quoteExists =
    openOrders && openOrders.quoteTokenTotal && openOrders.quoteTokenFree
  if (
    baseCurrency === 'UNKNOWN' ||
    quoteCurrency === 'UNKNOWN' ||
    !baseCurrency ||
    !quoteCurrency
  ) {
    return []
  }
  return [
    {
      market,
      key: `${baseCurrency}${quoteCurrency}${baseCurrency}`,
      coin: baseCurrency,
      wallet: baseCurrencyBalances,
      orders:
        baseExists && market
          ? market.baseSplSizeToNumber(
              openOrders.baseTokenTotal.sub(openOrders.baseTokenFree)
            )
          : null,
      openOrders,
      unsettled:
        baseExists && market
          ? market.baseSplSizeToNumber(openOrders.baseTokenFree)
          : null,
      refreshBase,
    },
    {
      market,
      key: `${quoteCurrency}${baseCurrency}${quoteCurrency}`,
      coin: quoteCurrency,
      wallet: quoteCurrencyBalances,
      openOrders,
      orders:
        quoteExists && market
          ? market.quoteSplSizeToNumber(
              openOrders.quoteTokenTotal.sub(openOrders.quoteTokenFree)
            )
          : null,
      unsettled:
        quoteExists && market
          ? market.quoteSplSizeToNumber(openOrders.quoteTokenFree)
          : null,
      refreshQuote,
    },
  ]
}

export function useWalletBalancesForAllMarkets() {
  const { connected, wallet } = useWallet()

  const connection = useConnection()
  const allMarkets = useAllMarkets()

  async function getWalletBalancesForAllMarkets() {
    let balances = []
    if (!connected) {
      return balances
    }

    let marketData
    for (marketData of allMarkets) {
      const { market, marketName } = marketData
      if (!market) {
        return balances
      }
      const baseCurrency = marketName.includes('/') && marketName.split('/')[0]
      if (!balances.find((balance) => balance.coin === baseCurrency)) {
        const baseBalance = await getCurrencyBalance(
          market,
          connection,
          wallet,
          true
        )
        balances.push({
          key: baseCurrency,
          coin: baseCurrency,
          wallet: baseBalance,
        })
      }
      const quoteCurrency = marketName.includes('/') && marketName.split('/')[1]
      if (!balances.find((balance) => balance.coin === quoteCurrency)) {
        const quoteBalance = await getCurrencyBalance(
          market,
          connection,
          wallet,
          false
        )
        balances.push({
          key: quoteCurrency,
          coin: quoteCurrency,
          wallet: quoteBalance,
        })
      }
    }

    return balances
  }

  return useAsyncData(
    getWalletBalancesForAllMarkets,
    tuple(
      'getWalletBalancesForAllMarkets',
      connected,
      connection,
      wallet,
      allMarkets
    ),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

async function getCurrencyBalance(market, connection, wallet, base = true) {
  const currencyAccounts = base
    ? await market.findBaseTokenAccountsForOwner(connection, wallet.publicKey)
    : await market.findQuoteTokenAccountsForOwner(connection, wallet.publicKey)
  const currencyAccount = currencyAccounts && currencyAccounts[0]
  const tokenAccountBalances = await connection.getTokenAccountBalance(
    currencyAccount.pubkey
  )
  return tokenAccountBalances?.value?.uiAmount
}

export function useOpenOrderAccountBalancesForAllMarkets() {
  const { connected, wallet } = useWallet()

  const connection = useConnection()
  const allMarkets = useAllMarkets()

  async function getOpenOrderAccountsForAllMarkets() {
    let accounts = []
    if (!connected) {
      return accounts
    }

    let marketData
    for (marketData of allMarkets) {
      const { market, marketName } = marketData
      if (!market) {
        return accounts
      }
      const openOrderAccounts = await market.findOpenOrdersAccountsForOwner(
        connection,
        wallet.publicKey
      )
      if (!openOrderAccounts) {
        continue
      }
      const baseCurrencyAccounts = await market.findBaseTokenAccountsForOwner(
        connection,
        wallet.publicKey
      )
      const quoteCurrencyAccounts = await market.findQuoteTokenAccountsForOwner(
        connection,
        wallet.publicKey
      )

      const baseCurrency = marketName.includes('/') && marketName.split('/')[0]
      const quoteCurrency = marketName.includes('/') && marketName.split('/')[1]

      const openOrderAccountBalances = []
      openOrderAccounts.forEach((openOrdersAccount) => {
        const inOrdersBase =
          openOrdersAccount?.baseTokenTotal &&
          openOrdersAccount?.baseTokenFree &&
          market.baseSplSizeToNumber(
            openOrdersAccount.baseTokenTotal.sub(
              openOrdersAccount.baseTokenFree
            )
          )
        const inOrdersQuote =
          openOrdersAccount?.quoteTokenTotal &&
          openOrdersAccount?.quoteTokenFree &&
          market.baseSplSizeToNumber(
            openOrdersAccount.quoteTokenTotal.sub(
              openOrdersAccount.quoteTokenFree
            )
          )
        const unsettledBase =
          openOrdersAccount?.baseTokenFree &&
          market.baseSplSizeToNumber(openOrdersAccount.baseTokenFree)
        const unsettledQuote =
          openOrdersAccount?.quoteTokenFree &&
          market.baseSplSizeToNumber(openOrdersAccount.quoteTokenFree)
        openOrderAccountBalances.push({
          market: marketName,
          coin: baseCurrency,
          key: baseCurrency,
          orders: inOrdersBase,
          unsettled: unsettledBase,
          openOrdersAccount: openOrdersAccount,
          baseCurrencyAccount: baseCurrencyAccounts && baseCurrencyAccounts[0],
          quoteCurrencyAccount:
            quoteCurrencyAccounts && quoteCurrencyAccounts[0],
        })
        openOrderAccountBalances.push({
          market: marketName,
          coin: quoteCurrency,
          key: quoteCurrency,
          orders: inOrdersQuote,
          unsettled: unsettledQuote,
          openOrdersAccount: openOrdersAccount,
          baseCurrencyAccount: baseCurrencyAccounts && baseCurrencyAccounts[0],
          quoteCurrencyAccount:
            quoteCurrencyAccounts && quoteCurrencyAccounts[0],
        })
      })
      accounts = accounts.concat(openOrderAccountBalances)
    }

    return accounts
  }

  return useAsyncData(
    getOpenOrderAccountsForAllMarkets,
    tuple(
      'getOpenOrderAccountsForAllMarkets',
      connected,
      connection,
      wallet,
      allMarkets
    ),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

export function useUnmigratedDeprecatedMarkets() {
  const connection = useConnection()
  const { accounts } = useUnmigratedOpenOrdersAccounts()
  const marketsList =
    accounts &&
    Array.from(new Set(accounts.map((openOrders) => openOrders.market)))
  const deps = marketsList && marketsList.map((m) => m.toBase58())

  const useUnmigratedDeprecatedMarketsInner = async () => {
    if (!marketsList) {
      return null
    }
    const getMarket = async (address) => {
      const marketInfo = USE_MARKETS.find((market) =>
        market.address.equals(address)
      )
      try {
        console.log('Loading market', marketInfo.name)
        // NOTE: Should this just be cached by (connection, marketInfo.address, marketInfo.programId)?
        return await Market.load(
          connection,
          marketInfo.address,
          {},
          marketInfo.programId
        )
      } catch (e) {
        console.log('Failed loading market', marketInfo.name, e)
        notify({
          message: 'Error loading market',
          description: e.message,
          type: 'error',
        })
        return null
      }
    }
    return (await Promise.all(marketsList.map(getMarket))).filter((x) => x)
  }
  const [markets] = useAsyncData(
    useUnmigratedDeprecatedMarketsInner,
    tuple(
      'useUnmigratedDeprecatedMarketsInner',
      connection,
      deps && deps.toString()
    ),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )
  if (!markets) {
    return null
  }
  return markets.map((market) => ({
    market,
    openOrdersList: accounts.filter((openOrders) =>
      openOrders.market.equals(market.address)
    ),
  }))
}

export function useGetOpenOrdersForDeprecatedMarkets() {
  const { connected, wallet } = useWallet()
  const [customMarkets] = useLocalStorageState('customMarkets', [])
  const connection = useConnection()
  const marketsAndOrders = useUnmigratedDeprecatedMarkets()
  const marketsList =
    marketsAndOrders && marketsAndOrders.map(({ market }) => market)

  // This isn't quite right: open order balances could change
  const deps =
    marketsList && marketsList.map((market) => market.address.toBase58())

  async function getOpenOrdersForDeprecatedMarkets() {
    if (!connected) {
      return null
    }
    if (!marketsList) {
      return null
    }
    console.log('refreshing getOpenOrdersForDeprecatedMarkets')
    const getOrders = async (market) => {
      const { marketName } = getMarketDetails(market, customMarkets)
      try {
        console.log('Fetching open orders for', marketName)
        // Can do better than this, we have the open orders accounts already
        return (
          await market.loadOrdersForOwner(connection, wallet.publicKey)
        ).map((order) => ({ marketName, market, ...order }))
      } catch (e) {
        console.log('Failed loading open orders', market.address.toBase58(), e)
        notify({
          message: `Error loading open orders for deprecated ${marketName}`,
          description: e.message,
          type: 'error',
        })
        return null
      }
    }
    return (await Promise.all(marketsList.map(getOrders)))
      .filter((x) => x)
      .flat()
  }

  const cacheKey = tuple(
    'getOpenOrdersForDeprecatedMarkets',
    connected,
    connection,
    wallet,
    deps && deps.toString()
  )
  const [openOrders, loaded] = useAsyncData(
    getOpenOrdersForDeprecatedMarkets,
    cacheKey,
    {
      refreshInterval: _VERY_SLOW_REFRESH_INTERVAL,
    }
  )
  console.log('openOrders', openOrders)
  return {
    openOrders,
    loaded,
    refreshOpenOrders: () => refreshCache(cacheKey),
  }
}

export function useBalancesForDeprecatedMarkets() {
  const markets = useUnmigratedDeprecatedMarkets()
  const [customMarkets] = useLocalStorageState('customMarkets', [])
  if (!markets) {
    return null
  }

  const openOrderAccountBalances = []
  markets.forEach(({ market, openOrdersList }) => {
    const { baseCurrency, quoteCurrency, marketName } = getMarketDetails(
      market,
      customMarkets
    )
    openOrdersList.forEach((openOrders) => {
      const inOrdersBase =
        openOrders?.baseTokenTotal &&
        openOrders?.baseTokenFree &&
        market.baseSplSizeToNumber(
          openOrders.baseTokenTotal.sub(openOrders.baseTokenFree)
        )
      const inOrdersQuote =
        openOrders?.quoteTokenTotal &&
        openOrders?.quoteTokenFree &&
        market.baseSplSizeToNumber(
          openOrders.quoteTokenTotal.sub(openOrders.quoteTokenFree)
        )
      const unsettledBase =
        openOrders?.baseTokenFree &&
        market.baseSplSizeToNumber(openOrders.baseTokenFree)
      const unsettledQuote =
        openOrders?.quoteTokenFree &&
        market.baseSplSizeToNumber(openOrders.quoteTokenFree)

      openOrderAccountBalances.push({
        marketName,
        market,
        coin: baseCurrency,
        key: `${marketName}${baseCurrency}`,
        orders: inOrdersBase,
        unsettled: unsettledBase,
        openOrders,
      })
      openOrderAccountBalances.push({
        marketName,
        market,
        coin: quoteCurrency,
        key: `${marketName}${quoteCurrency}`,
        orders: inOrdersQuote,
        unsettled: unsettledQuote,
        openOrders,
      })
    })
  })
  return openOrderAccountBalances
}

export function getMarketInfos(customMarkets) {
  const customMarketsInfo = customMarkets.map((m) => ({
    ...m,
    address: new PublicKey(m.address),
    programId: new PublicKey(m.programId),
  }))

  // TODO: we should use useMarketsList first to not find
  // pair from custom market by name (in this way we cover case when pair with
  // the same name will be in our market list and cusom markets)
  return [...useMarketsList(), ...customMarketsInfo]
}

export function useSelectedTokenAccounts(): [
  SelectedTokenAccounts,
  (newSelectedTokenAccounts: SelectedTokenAccounts) => void
] {
  const [
    selectedTokenAccounts,
    setSelectedTokenAccounts,
  ] = useLocalStorageState<SelectedTokenAccounts>('selectedTokenAccounts', {})
  return [selectedTokenAccounts, setSelectedTokenAccounts]
}

export async function getOpenOrdersAccountsCustom(connection, wallet, market) {
  return await market.findOpenOrdersAccountsForOwner(
    connection,
    wallet.publicKey
  )
}

export const getTokenMintAddressByName = (name: string): string | null => {
  return ALL_TOKENS_MINTS_MAP[name]?.toString()
}

export const getTokenNameByMintAddress = (address: string): string => {
  if (!address) {
    return '--'
  }

  const tokenName = ALL_TOKENS_MINTS_MAP[address]

  if (tokenName) {
    return tokenName
  }

  return `${address.slice(0, 3)}...${address.slice(address.length - 3)}`
}
