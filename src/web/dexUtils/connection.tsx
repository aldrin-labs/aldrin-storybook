import {
  Account,
  AccountInfo,
  clusterApiUrl,
  Connection,
  PublicKey,
} from '@solana/web3.js'
import React, { useContext, useCallback } from 'react'
import useSWR from 'swr'

import { MultiEndpointsConnection, AldrinConnection } from '@core/solana'

export const MAINNET_BETA_ENDPOINT = clusterApiUrl('mainnet-beta')
export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: MAINNET_BETA_ENDPOINT,
  },
]

const connection = new MultiEndpointsConnection(
  [
    // { url: 'https://solana-api.projectserum.com', weight: 2 },
    { url: 'https://api-cryptocurrencies-ai.rpcpool.com', weight: 20 },
    // { url: ' https://jupiter.genesysgo.net', weight: 20 },
    // { url: 'https://aldrin-aldrin-3110.mainnet.rpcpool.com', weight: 20 },
    // { url: 'https://solana-api.ccai.khassanov.xyz/figment', weight: 20 },
    // { url: 'https://aldrinexchange.genesysgo.net', weight: 3 },
    // { url: 'https://api.mainnet-beta.solana.com', weight: 2 },
  ],
  'confirmed'
)

connection.connections.forEach((c) => {
  c.onSlotChange(() => null)
  c.onAccountChange(new Account().publicKey, () => {})
})

const serumConnection = new MultiEndpointsConnection([
  { url: 'https://solana-api.projectserum.com', weight: 2 },
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

export function useConnection(): AldrinConnection {
  return useContext(ConnectionContext).connection as AldrinConnection
}

export function useMultiEndpointConnection(): AldrinConnection {
  return useContext(ConnectionContext).connection as AldrinConnection
}

export function useSerumConnection(): Connection {
  return useContext(ConnectionContext).serumConnection as unknown as Connection
}

export function useConnectionConfig() {
  const ctx = useContext(ConnectionContext)
  return { endpoint: ctx.endpoint, setEndpoint: ctx.setEndpoint }
}
export function useAccountInfo(publicKey: PublicKey | undefined | null): {
  data: AccountInfo<Buffer> | null | undefined
  isLoading: boolean
  error: Error | undefined
} {
  const connection = useConnection()

  const fetcher = useCallback(
    () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    [publicKey]
  )

  const { data, error } = useSWR(
    `userAccountInfo_${publicKey?.toBase58()}`,
    fetcher,
    {
      refreshInterval: 3_000,
    }
  )

  return {
    data,
    isLoading: typeof data === 'undefined',
    error,
  }
}

export function useAccountData(publicKey) {
  const { data: accountInfo } = useAccountInfo(publicKey)
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
