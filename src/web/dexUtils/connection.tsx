import { useLocalStorageState } from './utils'
import { Account, clusterApiUrl, Connection } from '@solana/web3.js'
import React, { useContext, useEffect, useMemo } from 'react'
import { refreshCache, setCache, useAsyncData } from './fetch-loop'
import tuple from 'immutable-tuple'
import MultiEndpointsConnection from './MultiEndpointsConnection'

export const ENDPOINTS = [
  {
    name: 'serum-endpoint-mainnet-beta',
    endpoint: 'https://solana-api.projectserum.com',
  },
  {
    name: 'solana-endpoint-mainnet-beta',
    endpoint: 'https://api.mainnet-beta.solana.com',
  },
  { name: 'testnet', endpoint: clusterApiUrl('testnet') },
  { name: 'devnet', endpoint: clusterApiUrl('devnet') },
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
      new MultiEndpointsConnection(
        [
          { endpoint: 'https://solana-api.projectserum.com', RPS: 4 },
          { endpoint: 'https://api.mainnet-beta.solana.com', RPS: 4 },
        ],
        'recent'
      ),
    [endpoint]
  )

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {})
    return () => connection.removeAccountChangeListener(id)
  }, [connection])

  useEffect(() => {
    const id = connection.onSlotChange(() => null)
    return () => connection.removeSlotChangeListener(id)
  }, [connection])

  return (
    <ConnectionContext.Provider
      value={{ endpoint, setEndpoint, connection, sendConnection: connection }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  return useContext(ConnectionContext).connection
}

export function useConnectionConfig() {
  const context = useContext(ConnectionContext)
  return { endpoint: context.endpoint, setEndpoint: context.setEndpoint }
}

export function useAccountInfo(publicKey) {
  const connection = useConnection()
  const cacheKey = tuple(connection, publicKey?.toBase58())
  const [accountInfo, loaded] = useAsyncData(
    async () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    cacheKey,
    { refreshInterval: 60_000 }
  )
  const refresh = () => refreshCache(cacheKey)

  useEffect(() => {
    if (!publicKey) {
      return
    }
    if (accountListenerCount.has(cacheKey)) {
      let currentItem = accountListenerCount.get(cacheKey)
      ++currentItem.count
    } else {
      let previousData = null
      const subscriptionId = connection.onAccountChange(publicKey, (e) => {
        if (e.data) {
          if (!previousData || !previousData.equals(e.data)) {
            setCache(cacheKey, e)
          } else {
          }
          previousData = e.data
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

  return [accountInfo, loaded, refresh]
}

export function useAccountData(publicKey) {
  const [accountInfo] = useAccountInfo(publicKey)
  return accountInfo && accountInfo.data
}
