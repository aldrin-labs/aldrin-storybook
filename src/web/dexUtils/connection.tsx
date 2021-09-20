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
import { useHistory } from 'react-router-dom'

export const MAINNET_BETA_ENDPOINT = clusterApiUrl('mainnet-beta')
export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: MAINNET_BETA_ENDPOINT,
  },
  { name: 'testnet', endpoint: clusterApiUrl('testnet') },
  { name: 'devnet', endpoint: 'https://api.devnet.solana.com' },
  { name: 'localnet', endpoint: 'http://127.0.0.1:8899' },
]

const ConnectionContext = React.createContext(null)

export function ConnectionProvider({ children }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    'connectionEndpts',
    ENDPOINTS[0].endpoint
  )

  const history = useHistory()
  const { pathname } = history.location

  console.log('pathname', pathname, pathname === '/dashboard')
  // projectserum connection for dashboard

  const connection = useMemo(
    () =>
      endpoint === MAINNET_BETA_ENDPOINT
        ? // multi connection only for mainnet
          new MultiEndpointsConnection(
            [
              // { url: 'https://solana-api.projectserum.com', RPS: 2 },
              // { url: 'https://api.mainnet-beta.solana.com', RPS: 4 },
              { url: 'https://api-cryptocurrencies-ai.rpcpool.com', RPS: 20 },
            ],
            'recent'
          )
        : new MultiEndpointsConnection(
            [
              {
                url:
                  ENDPOINTS.find(
                    (endpointInfo) => endpointInfo.endpoint === endpoint
                  )?.endpoint || MAINNET_BETA_ENDPOINT,
                RPS: 20,
              },
            ],
            'recent'
          ),
    [endpoint]
  )

  const serumConnection = useMemo(
    () =>
      endpoint === MAINNET_BETA_ENDPOINT
        ? new MultiEndpointsConnection(
            [
              { url: 'https://solana-api.projectserum.com', RPS: 2 },
              // { url: 'https://api.mainnet-beta.solana.com', RPS: 4 },
              // { url: 'https://api-cryptocurrencies-ai.rpcpool.com', RPS: 20 },
            ],
            'recent'
          )
        : new MultiEndpointsConnection(
            [
              {
                url:
                  ENDPOINTS.find(
                    (endpointInfo) => endpointInfo.endpoint === endpoint
                  )?.endpoint || MAINNET_BETA_ENDPOINT,
                RPS: 20,
              },
            ],
            'recent'
          ),
    [endpoint]
  )

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const rawConnection = connection.getConnection()

    const id = rawConnection.onAccountChange(new Account().publicKey, () => {})

    return () => {
      rawConnection.removeAccountChangeListener(id)
    }
  }, [endpoint, connection])

  useEffect(() => {
    const rawConnection = connection.getConnection()

    const id = rawConnection.onSlotChange(() => null)

    return () => {
      rawConnection.removeSlotChangeListener(id)
    }
  }, [endpoint, connection])

  return (
    <ConnectionContext.Provider
      value={{ endpoint, setEndpoint, connection, serumConnection }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}
export function useConnection(): Connection {
  return useContext(ConnectionContext).connection
}

export function useSerumConnection(): Connection {
  return useContext(ConnectionContext).serumConnection
}

export function useConnectionConfig() {
  const context = useContext(ConnectionContext)
  return { endpoint: context.endpoint, setEndpoint: context.setEndpoint }
}
export function useAccountInfo(
  publicKey: PublicKey | undefined | null
): [AccountInfo<Buffer> | null | undefined, boolean] {
  const connection = useConnection()
  const cacheKey = tuple('useAccountInfo', publicKey?.toBase58())
  const [accountInfo, loaded] = useAsyncData<AccountInfo<Buffer> | null>(
    async () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    cacheKey,
    { refreshInterval: 3_000 }
  )

  // useEffect(() => {
  //   if (!publicKey) {
  //     return
  //   }
  //   if (accountListenerCount.has(cacheKey)) {
  //     let currentItem = accountListenerCount.get(cacheKey)
  //     ++currentItem.count
  //   } else {
  //     let previousInfo: AccountInfo<Buffer> | null = null
  //     const subscriptionId = connection.onAccountChange(publicKey, (info) => {
  //       if (
  //         !previousInfo ||
  //         !previousInfo.data.equals(info.data) ||
  //         previousInfo.lamports !== info.lamports
  //       ) {
  //         // probably here is memory leak, sometimes this code executes realy frequently and block whole page
  //         // console.log('connection', connection, info)
  //         // console.log(
  //         //   'setCache useAccountInfo',
  //         //   connection,
  //         //   info,
  //         //   previousInfo,
  //         //   previousInfo?.data.equals(info.data),
  //         //   previousInfo?.lamports === info.lamports
  //         // )
  //         previousInfo = info
  //         setCache(cacheKey, info)
  //       }
  //     })
  //     accountListenerCount.set(cacheKey, { count: 1, subscriptionId })
  //   }
  //   return () => {
  //     let currentItem = accountListenerCount.get(cacheKey)
  //     let nextCount = currentItem.count - 1
  //     if (nextCount <= 0) {
  //       connection.removeAccountChangeListener(currentItem.subscriptionId)
  //       accountListenerCount.delete(cacheKey)
  //     } else {
  //       --currentItem.count
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cacheKey])

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

export const getConnectionFromMultiConnections = ({ connection }) => {
  const rawConnection = connection?.getConnection()
  console.log('rawConnection', rawConnection)

  return rawConnection
}

export const getProviderNameFromUrl = ({ rawConnection }) => {
  const rpcProvider = rawConnection._rpcEndpoint
    .replace('https://', '')
    .replaceAll('.', '-')

  return rpcProvider
}
