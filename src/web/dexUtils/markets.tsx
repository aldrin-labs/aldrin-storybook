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
import { Account, AccountInfo, PublicKey, SystemProgram } from '@solana/web3.js'
import React, { useContext, useEffect, useState } from 'react'
import { getUniqueListBy, useLocalStorageState } from './utils'
import { getCache, refreshCache, setCache, useAsyncData } from './fetch-loop'
import {
  getProviderNameFromUrl,
  useAccountData,
  useAccountInfo,
  useConnection,
  useConnectionConfig,
} from './connection'
import { useWallet } from './wallet'
import tuple from 'immutable-tuple'
import { notify } from './notifications'
import { BN } from 'bn.js'
import { getTokenAccountInfo } from './tokens'
import {
  useAwesomeMarkets,
  AWESOME_TOKENS,
} from '@core/utils/awesomeMarkets/serum'
import { DEX_PID, getDexProgramIdByEndpoint } from '@core/config/dex'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from './token/token'
import { Metrics } from '../../../../core/src/utils/metrics'

export const ALL_TOKENS_MINTS = getUniqueListBy(
  [...TOKEN_MINTS, ...AWESOME_TOKENS],
  'name'
)

console.log('ALL_TOKENS_MINTS', ALL_TOKENS_MINTS)

export const ALL_TOKENS_MINTS_MAP = ALL_TOKENS_MINTS.reduce((acc, el) => {
  acc[el.address] = el.name
  acc[el.name] = el.address

  return acc
}, {})

export const REFFERER_ACCOUNT_ADDRESSES: {[key: string]: string | undefined}  = {
  "USDT": process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS,
  "USDC": process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS,
  "SOL": process.env.REACT_APP_SOL_REFERRAL_FEES_ADDRESS,
  "WUSDT": process.env.REACT_APP_WUSDT_REFERRAL_FEES_ADDRESS,
  "ODOP": process.env.REACT_APP_ODOP_REFERRAL_FEES_ADDRESS,
  "TRYB": process.env.REACT_APP_TRYB_REFERRAL_FEES_ADDRESS,
  "SRM": process.env.REACT_APP_SRM_REFERRAL_FEES_ADDRESS,
  "ETH": process.env.REACT_APP_ETH_REFERRAL_FEES_ADDRESS,
  "RAY": process.env.REACT_APP_RAY_REFERRAL_FEES_ADDRESS,
}


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
        name: 'RIN/USDC',
        programId: new PublicKey(
          '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
        ),
        deprecated: false,
      },
    ].concat(MARKETS)
// : MARKETS

export interface RawMarketData {
  name: string
  address: PublicKey
  programId: PublicKey
  deprecated: boolean
}
export interface RawCustomMarketData extends RawMarketData {
  isCustomUserMarket: boolean
}

export type MarketsMap = Map<string, RawMarketData>

export function useAllMarketsList(): MarketsMap {
  const allMarketsMapByName = new Map()
  const allMarketsMapById = new Map()

  const { customMarkets } = useCustomMarkets()

  const serumMarkets = useMarketsList()
  const awesomeMarkets = useAwesomeMarkets()

  const officialMarkets = [...serumMarkets, ...awesomeMarkets]

  officialMarkets?.forEach((market: RawMarketData) => {
    const marketName = market.name.replaceAll('/', '_')
    allMarketsMapByName.set(marketName, { ...market, name: marketName })
    allMarketsMapById.set(market.address.toString(), {
      ...market,
      name: marketName,
    })
  })

  const usersMarkets = customMarkets.filter((market: RawCustomMarketData) => {
    const marketName = market.name.replaceAll('/', '_')
    const isCustomMarketAlreadyExistInOfficial = allMarketsMapById.has(
      market.address
    )

    return (
      market.isCustomUserMarket &&
      !allMarketsMapByName.has(marketName) &&
      !isCustomMarketAlreadyExistInOfficial
    )
  })

  usersMarkets?.forEach((market: RawMarketData) => {
    const marketName = market.name.replaceAll('/', '_')

    allMarketsMapByName.set(marketName, {
      ...market,
      name: marketName,
      address: new PublicKey(market.address),
      programId: new PublicKey(market.programId),
    })
  })

  return allMarketsMapByName
}

export function useAllMarketsMapById(): MarketsMap {
  const allMarketsMap = useAllMarketsList()

  const allMarketsMapById = [...allMarketsMap.values()].reduce(
    (acc, current) => {
      acc.set(current.address.toString(), current)
      return acc
    },
    new Map()
  )

  return allMarketsMapById
}

export function useMarketsList() {
  const { endpoint } = useConnectionConfig()
  const programId = getDexProgramIdByEndpoint(endpoint)

  const UPDATED_USE_MARKETS = USE_MARKETS.filter(
    (el) =>
      !el.deprecated ||
      (el.name.includes('/WUSDT') &&
        el.programId.toBase58() === programId.toString())
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
  const marketInfos = getMarketInfos(customMarkets)

  const getAllMarkets = async () => {
    let i = 0
    const markets: Array<{
      market: Market
      marketName: string
      programId: PublicKey
    } | null> =
      // .slice(0, 2)
      marketInfos.map(async (marketInfo) => {
        try {
          // console.log('marketInfo.address', marketInfo.address, ++i)
          const market = await Market.load(
            connection,
            marketInfo.address,
            {},
            marketInfo.programId
          )

          const asks = await market.loadAsks(connection)
          const bids = await market.loadBids(connection)

          return {
            market,
            marketName: marketInfo.name,
            programId: marketInfo.programId,
            asks,
            bids,
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

export const _VERY_SLOW_REFRESH_INTERVAL = 5000 * 1000

// For things that don't really change
const _SLOW_REFRESH_INTERVAL = 3 * 1000

// For things that change frequently
const _FAST_REFRESH_INTERVAL = 1 * 1000

export const DEFAULT_MARKET = USE_MARKETS.find(
  ({ name, deprecated }) => name === 'SRM/USDT' && !deprecated
)

function getMarketDetails(market, marketInfos) {
  if (!market) {
    return {}
  }

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

  return {
    ...marketInfo,
    marketName: marketInfo?.name,
    baseCurrency,
    quoteCurrency,
    marketInfo,
  }
}

const getPairFromLocation = () => {
  let pair = 'RIN_USDC'
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

    if (!marketInfo?.address) {
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
      .catch((e) => {
        console.log('e', e)
        const rpcUrl = getProviderNameFromUrl({ rawConnection: connection })
        Metrics.sendMetrics({metricName: `error.rpc.${rpcUrl}.marketFetch`})
        notify({
          message: 'Error loading market',
          description: e.message,
          type: 'error',
        })
      })
    // eslint-disable-next-line
  }, [connection, marketInfo])

  const marketData = getMarketDetails(market, marketInfos)

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

  const [orderbook] = useOrderbook(2)

  useEffect(() => {
    let bb = orderbook?.bids?.length > 0 && Number(orderbook.bids[0][0])
    let ba = orderbook?.asks?.length > 0 && Number(orderbook.asks[0][0])

    let markPrice = bb && ba ? (bb + ba) / 2 : null

    setMarkPrice(markPrice)
  }, [orderbook])

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
    { refreshInterval: 10_000 }
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

export function useOrderbook(depth = 200) {
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

const useOpenOrdersPubkeys = (): string[] => {
  const { market } = useMarket()
  const { connected, wallet } = useWallet()
  const connection = useConnection()

  const openOrdersKey = `openOrdersPubkeys-${wallet?.publicKey}-${market?.publicKey}-${DEX_PID}`

  async function getOpenOrdersAccounts() {
    if (!connected) {
      return null
    }
    if (!market) {
      return null
    }

    // const openOrdersPubkeys = []
    // JSON.parse(
    //   localStorage.getItem(openOrdersKey) || '[]'
    // )

    // check localStorage for existing openOrdersAccount for current market + wallet
    // if (openOrdersPubkeys && openOrdersPubkeys.length > 0)
    //   return openOrdersPubkeys.map((acc: string) => new PublicKey(acc))

    const accounts = await market.findOpenOrdersAccountsForOwner(
      connection,
      wallet.publicKey
    )

    // BE AWARE: .sort() mutates the arrey

    const sortedAccountsByCountOfExistingOpenOrders = accounts.sort(
      (a: { freeSlotBits: typeof BN }, b: { freeSlotBits: typeof BN }) =>
        a?.freeSlotBits?.cmp(b?.freeSlotBits)
    )
    const sortedAccountsByUnsettledBalances = sortedAccountsByCountOfExistingOpenOrders.sort(
      (
        a: { baseTokenFree: typeof BN; quoteTokenFree: typeof BN },
        b: { baseTokenFree: typeof BN; quoteTokenFree: typeof BN }
      ) =>
        a?.baseTokenFree.cmp(b?.baseTokenFree) === 1 ||
        a?.quoteTokenFree.cmp(b?.quoteTokenFree) === 1
          ? -1
          : a?.baseTokenFree.cmp(b?.baseTokenFree) === -1 ||
            a?.quoteTokenFree.cmp(b?.quoteTokenFree) === -1
          ? 1
          : 0
    )

    console.log(
      '[getOpenOrdersAccounts] current openOrderAccount: ',
      sortedAccountsByUnsettledBalances[0]?.address?.toBase58()
    )

    // keep string addresses in localStorage
    // localStorage.setItem(
    //   openOrdersKey,
    //   JSON.stringify(
    //     sortedAccountsByCountOfExistingOpenOrders.map((acc: OpenOrders) => acc.publicKey?.toString())
    //   )
    // )

    return sortedAccountsByUnsettledBalances.map(
      (acc: OpenOrders) => acc.publicKey
    )
  }

  return useAsyncData(
    getOpenOrdersAccounts,
    tuple('getOpenOrdersAccountsFromProgramAccounts', connected, openOrdersKey),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )
}

// Want the balances table to be fast-updating, dont want open orders to flicker
// TODO: Update to use websocket
export function useOpenOrdersAccounts(fast = false) {
  const { market } = useMarket()
  const { connected, wallet } = useWallet()
  const connection = useConnection()

  const [openOrdersPubkeys] = useOpenOrdersPubkeys()

  async function getOpenOrdersAccounts() {
    if (!connected) {
      return null
    }
    if (!market) {
      return null
    }

    const isOpenOrdersAlreadyCreated =
      openOrdersPubkeys && openOrdersPubkeys.length > 0

    let preCreatedOpenOrders = getCache(
      `preCreatedOpenOrdersFor${market?.publicKey}`
    )
    let openOrdersPublicKey = null

    // for already created openOrders account we take pubkey
    if (isOpenOrdersAlreadyCreated) {
      openOrdersPublicKey = openOrdersPubkeys[0]
    } else if (!preCreatedOpenOrders) {
      // for not created oo + not added to cache we create oo pubkey
      // that will be used in order creation
      preCreatedOpenOrders = new Account()
      openOrdersPublicKey = preCreatedOpenOrders?.publicKey
      setCache(
        `preCreatedOpenOrdersFor${market?.publicKey}`,
        preCreatedOpenOrders
      )
    } else {
      // for not created but setted in cache we take pubkey
      openOrdersPublicKey = preCreatedOpenOrders?.publicKey
    }

    // update openOrders info by address
    const openOrdersAccountInfo = await connection.getAccountInfo(
      openOrdersPublicKey
    )

    if (!openOrdersAccountInfo) {
      return null
    }

    const openOrdersAccount = OpenOrders.fromAccountInfo(
      openOrdersPublicKey,
      openOrdersAccountInfo,
      DEX_PID
    )

    // for using several openOrdersAccoutns we'll need to update this method
    // currently it updates info only for first OO
    return [openOrdersAccount]
  }

  return useAsyncData(
    getOpenOrdersAccounts,
    tuple(
      'getOpenOrdersAccountsWithPreCached',
      wallet,
      market,
      connected,
      openOrdersPubkeys
    ),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

export function useAllOpenOrdersAccounts() {
  const { connected, wallet } = useWallet()
  const connection = useConnection()

  async function getOpenOrdersAccounts() {
    if (!connected) {
      return null
    }

    const openOrdersAccounts = await OpenOrders.findForOwner(
      connection,
      wallet.publicKey,
      DEX_PID
    )

    return openOrdersAccounts
  }

  return useAsyncData(
    getOpenOrdersAccounts,
    tuple('useAllOpenOrdersAccounts', wallet, connected),
    { refreshInterval: _SLOW_REFRESH_INTERVAL }
  )
}

export function useSelectedOpenOrdersAccount(fast = false) {
  const [accounts] = useOpenOrdersAccounts(fast)

  if (!accounts) {
    return null
  }

  return accounts[0]
}

export type TokenAccount = {
  pubkey: PublicKey
  account: AccountInfo<Buffer>
  effectiveMint: PublicKey
}

export type TokenAccounts = TokenAccount[] | undefined | null

export function useTokenAccounts(): [TokenAccounts, boolean] {
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
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )
}

export function useTokenAccountsMap(): [Map<string, TokenAccount>, boolean] {
  const [accounts, loaded] = useTokenAccounts()

  if (!loaded || !accounts) return [new Map(), loaded]

  return [
    accounts.reduce(
      (acc, current) => acc.set(current.effectiveMint.toString(), current),
      new Map()
    ),
    loaded,
  ]
}

export function getSelectedTokenAccountForMint(
  market: Market,
  accounts: TokenAccount[] | undefined | null,
  mint: PublicKey | undefined,
  selectedPubKey?: string | PublicKey | null,
  side: 'base' | 'quote' = 'base'
) {
  if (!accounts || !mint) {
    return null
  }
  const isBaseToken = side === 'base'

  const filtered = accounts
    .filter(
      ({ effectiveMint, pubkey }) =>
        mint.equals(effectiveMint) &&
        (!selectedPubKey ||
          (typeof selectedPubKey === 'string'
            ? selectedPubKey
            : selectedPubKey.toBase58()) === pubkey.toBase58())
    )
    .sort((tokenA, tokenB) => {
      if (market.quoteMintAddress.equals(TokenInstructions.WRAPPED_SOL_MINT)) {
        const tokenABalance = tokenA.account.lamports / 1e9 ?? 0
        const tokenBBalance = tokenB.account.lamports / 1e9 ?? 0
        return tokenBBalance - tokenABalance
      }

      const tokenASplSize = new BN(tokenA.account.data.slice(64, 72), 10, 'le')
      const tokenBSplSize = new BN(tokenB.account.data.slice(64, 72), 10, 'le')

      const tokenABalance = isBaseToken
        ? market.baseSplSizeToNumber(tokenASplSize)
        : market.quoteSplSizeToNumber(tokenASplSize)

      const tokenBBalance = isBaseToken
        ? market.baseSplSizeToNumber(tokenBSplSize)
        : market.quoteSplSizeToNumber(tokenBSplSize)

      return tokenBBalance - tokenABalance
    })

  return filtered && filtered[0]
}

export function useSelectedQuoteCurrencyAccount() {
  const [accounts] = useTokenAccounts()
  const { market } = useMarket()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()

  const mintAddress = market?.quoteMintAddress

  const [associatedTokenAddress] = useAssociatedTokenAddressByMint(mintAddress)
  const [associatedTokenInfo] = useAccountInfo(associatedTokenAddress)

  const quoteTokenAddress = getSelectedTokenAccountForMint(
    market,
    accounts,
    mintAddress,
    mintAddress && selectedTokenAccounts[mintAddress.toBase58()],
    'quote'
  )

  // if not found in accounts, but token added as associated
  if (!quoteTokenAddress && associatedTokenInfo) {
    return {
      pubkey: associatedTokenAddress,
    }
  }

  return quoteTokenAddress
}

const useAssociatedTokenAddressByMint = (mint: PublicKey) => {
  const { connected, wallet } = useWallet()

  async function getAssociatedTokenAddress() {
    if (!connected) {
      return null
    }

    if (wallet.publicKey.equals(SystemProgram.programId)) {
      return null
    }

    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      wallet.publicKey
    )
  }

  return useAsyncData(
    getAssociatedTokenAddress,
    tuple('getAssociatedTokenAddress', mint, wallet.publicKey),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL }
  )
}

export function useSelectedBaseCurrencyAccount() {
  // getProgramAccounts
  const [accounts] = useTokenAccounts()
  const { market } = useMarket()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()

  const mintAddress = market?.baseMintAddress

  const [associatedTokenAddress] = useAssociatedTokenAddressByMint(mintAddress)
  const [associatedTokenInfo] = useAccountInfo(associatedTokenAddress)

  const baseTokenAddress = getSelectedTokenAccountForMint(
    market,
    accounts,
    mintAddress,
    mintAddress && selectedTokenAccounts[mintAddress.toBase58()],
    'base'
  )

  // if not found in accounts, but token added as associated
  if (!baseTokenAddress && associatedTokenInfo) {
    return {
      pubkey: associatedTokenAddress,
    }
  }

  return baseTokenAddress
}

// TODO: Update to use websocket
export function useQuoteCurrencyBalances() {
  // or accos here - try get account info
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

export function useBalances() {
  const { baseCurrency, quoteCurrency, market } = useMarket()

  const [baseCurrencyBalances, refreshBase] = useBaseCurrencyBalances()
  const [quoteCurrencyBalances, refreshQuote] = useQuoteCurrencyBalances()

  const openOrders = useSelectedOpenOrdersAccount(true)

  const baseExists =
    openOrders && openOrders.baseTokenTotal && openOrders.baseTokenFree
  const quoteExists =
    openOrders && openOrders.quoteTokenTotal && openOrders.quoteTokenFree
  
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
        const rpcUrl = getProviderNameFromUrl({ rawConnection: connection })
        Metrics.sendMetrics({metricName: `error.rpc.${rpcUrl}.unmigratedMarketFetch`})
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

export function getMarketInfos(customMarkets) {
  const serumMarkets = useMarketsList()
  const customMarketsInfo = customMarkets.map((m) => ({
    ...m,
    address: new PublicKey(m.address),
    programId: new PublicKey(m.programId),
  }))

  // TODO: we should use useMarketsList first to not find
  // pair from custom market by name (in this way we cover case when pair with
  // the same name will be in our market list and cusom markets)
  return [...serumMarkets, ...customMarketsInfo]
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
