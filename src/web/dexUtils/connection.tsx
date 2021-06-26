import { useLocalStorageState } from './utils'
import {
  Account,
  AccountInfo,
  clusterApiUrl,
  Connection,
  PublicKey,
} from '@solana/web3.js'
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { refreshCache, setCache, useAsyncData } from './fetch-loop'
import tuple from 'immutable-tuple'
import MultiEndpointsConnection from './MultiEndpointsConnection'
const MAINNET_BETA_ENDPOINT = clusterApiUrl('mainnet-beta')
export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: MAINNET_BETA_ENDPOINT,
  },
  { name: 'testnet', endpoint: clusterApiUrl('testnet') },
  { name: 'devnet', endpoint: 'https://api.devnet.solana.com' },
  { name: 'localnet', endpoint: 'http://127.0.0.1:8899' },
]

const accountListenerCount = new Map()
const ConnectionContext = React.createContext(null)
export function ConnectionProvider({ children }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'connectionEndpts',
    ENDPOINTS[0].endpoint
  )

  const connection = useMemo(
    () =>
      endpoint === MAINNET_BETA_ENDPOINT
        ? // multi connection only for mainnet
          new MultiEndpointsConnection(
            [
              // { url: 'https://mango.rpcpool.com/', RPS: 10 },
              { url: 'https://solana-api.projectserum.com', RPS: 2 },
              { url: 'https://api.mainnet-beta.solana.com', RPS: 4 },
              { url: 'https://api-cryptocurrencies-ai.rpcpool.com', RPS: 20 },
              // { url: 'https://raydium.rpcpool.com/', RPS: 10 },
              // { url: 'https://orca.rpcpool.com/', RPS: 10 },
              // { url: 'https://api.rpcpool.com', RPS: 10 },
            ],
            'recent'
          )
        : new Connection(
            ENDPOINTS.find((endpointInfo) => endpointInfo.endpoint === endpoint)
              ?.endpoint || MAINNET_BETA_ENDPOINT,
            'recent'
          ),
    [endpoint]
  )
  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const rawConnection =
      endpoint === MAINNET_BETA_ENDPOINT
        ? connection.getConnection()
        : connection
    const id = rawConnection.onAccountChange(new Account().publicKey, () => {})
    return () => {
      rawConnection.removeAccountChangeListener(id)
    }
  }, [connection])

  useEffect(() => {
    const rawConnection =
      endpoint === MAINNET_BETA_ENDPOINT
        ? connection.getConnection()
        : connection
    const id = rawConnection.onSlotChange(() => null)
    return () => {
      rawConnection.removeSlotChangeListener(id)
    }
  }, [connection])

  return (
    <ConnectionContext.Provider value={{ endpoint, setEndpoint, connection }}>
      {children}
    </ConnectionContext.Provider>
  )
}
export function useConnection(): Connection {
  return useContext(ConnectionContext).connection
}
export function useConnectionConfig() {
  const context = useContext(ConnectionContext)
  return { endpoint: context.endpoint, setEndpoint: context.setEndpoint }
}
export function useAccountInfo(
  publicKey: PublicKey | undefined | null
): [AccountInfo<Buffer> | null | undefined, boolean] {
  const connection = useConnection()
  const cacheKey = tuple(connection, publicKey?.toBase58())
  const [accountInfo, loaded] = useAsyncData<AccountInfo<Buffer> | null>(
    async () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    cacheKey,
    { refreshInterval: 60_000 }
  )

  useEffect(() => {
    if (!publicKey) {
      return
    }
    if (accountListenerCount.has(cacheKey)) {
      let currentItem = accountListenerCount.get(cacheKey)
      ++currentItem.count
    } else {
      let previousInfo: AccountInfo<Buffer> | null = null
      const subscriptionId = connection.onAccountChange(publicKey, (info) => {
        if (
          !previousInfo ||
          !previousInfo.data.equals(info.data) ||
          previousInfo.lamports !== info.lamports
        ) {
          previousInfo = info
          setCache(cacheKey, info)
        }
      })
      accountListenerCount.set(cacheKey, { count: 1, subscriptionId })
    }
    return () => {
      let currentItem = accountListenerCount.get(cacheKey)
      let nextCount = currentItem.count - 1
      if (nextCount <= 0) {
        connection.removeAccountChangeListener(currentItem.subscriptionId)
        accountListenerCount.delete(cacheKey)
      } else {
        --currentItem.count
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey])
  const previousInfoRef = useRef<AccountInfo<Buffer> | null | undefined>(null)
  if (
    !accountInfo ||
    !previousInfoRef.current ||
    !previousInfoRef.current.data.equals(accountInfo.data) ||
    previousInfoRef.current.lamports !== accountInfo.lamports
  ) {
    previousInfoRef.current = accountInfo
  }
  return [previousInfoRef.current, loaded]
}

export function useAccountData(publicKey) {
  const [accountInfo] = useAccountInfo(publicKey)
  return accountInfo && accountInfo.data
}
