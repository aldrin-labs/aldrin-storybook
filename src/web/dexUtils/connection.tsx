import { Account, AccountInfo, clusterApiUrl, PublicKey } from '@solana/web3.js'
import React, { useContext, useRef } from 'react'
import tuple from 'immutable-tuple'
import { useAsyncData } from './fetch-loop'
import MultiEndpointsConnection from './MultiEndpointsConnection'

export const MAINNET_BETA_ENDPOINT = clusterApiUrl('mainnet-beta')
export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: MAINNET_BETA_ENDPOINT,
  },
]

const connection = new MultiEndpointsConnection(
  [
    { url: 'https://api-cryptocurrencies-ai.rpcpool.com', RPS: 10 },
    // { url: 'https://aldrinexchange.genesysgo.net', RPS: 20 },
  ],
  'recent'
)

connection.connections.forEach((c) => {
  c.onSlotChange(() => null)
  c.onAccountChange(new Account().publicKey, () => {})
})

const serumConnection = new MultiEndpointsConnection([
  { url: 'https://solana-api.projectserum.com', RPS: 2 },
])

const context = {
  connection,
  serumConnection,
  endpoint: ENDPOINTS[0].endpoint,
  setEndpoint: () => null, // compatibility
}

const ConnectionContext = React.createContext(context)

export const ConnectionProvider: React.FC = ({ children }) => {
  return (
    <ConnectionContext.Provider value={context}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection(): MultiEndpointsConnection {
  return useContext(ConnectionContext).connection
}

export function useSerumConnection(): MultiEndpointsConnection {
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
