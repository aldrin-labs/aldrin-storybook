import {
  Account,
  AccountInfo,
  clusterApiUrl,
  Connection,
  PublicKey,
} from '@solana/web3.js'
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

export function useConnection(): Connection {
  return useContext(ConnectionContext).connection as unknown as Connection
}

export function useSerumConnection(): Connection {
  return useContext(ConnectionContext).serumConnection as unknown as Connection
}

export function useConnectionConfig() {
  const { endpoint, setEndpoint } = useContext(ConnectionContext)
  return { endpoint, setEndpoint }
}
export function useAccountInfo(
  publicKey: PublicKey | undefined | null
): [AccountInfo<Buffer> | null | undefined, boolean] {
  const conn = useConnection()
  const cacheKey = tuple('useAccountInfo', publicKey?.toBase58())
  const [accountInfo, loaded] = useAsyncData<AccountInfo<Buffer> | null>(
    async () => (publicKey ? conn.getAccountInfo(publicKey) : null),
    cacheKey,
    { refreshInterval: 3_000 }
  )

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

export function useAccountData(publicKey: PublicKey) {
  const [accountInfo] = useAccountInfo(publicKey)
  return accountInfo && accountInfo.data
}

interface ConnectionData {
  connection: MultiEndpointsConnection
}

export const getConnectionFromMultiConnections = (data: ConnectionData) => {
  const rawConnection = data.connection?.getConnection()
  console.log('rawConnection', rawConnection)

  return rawConnection
}

interface ProviderData {
  rawConnection: Connection
}

export const getProviderNameFromUrl = (data: ProviderData) => {
  const rpcProvider = data.rawConnection._rpcEndpoint
    .replace('https://', '')
    .replaceAll('.', '-')

  return rpcProvider
}
