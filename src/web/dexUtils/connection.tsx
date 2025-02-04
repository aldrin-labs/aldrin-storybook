import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import React, { useContext, useCallback } from 'react'
import useSWR from 'swr'

import {
  MultiEndpointsConnection,
  AldrinConnection,
  MAINNET_URL,
} from '@core/solana'

export const ENDPOINTS = [
  {
    name: 'mainnet-beta',
    endpoint: MAINNET_URL,
  },
]

const providers = process.env.RPC_PROVIDERS_ADDRESSES
  ? JSON.parse(process.env.RPC_PROVIDERS_ADDRESSES)
  : [
      {
        url: 'https://rpc.helius.xyz/?api-key=923b03cb-c57e-4942-a22d-05331e591fdf',
        weight: 20,
      },
    ]

const connection = new MultiEndpointsConnection(providers, 'confirmed')

const serumConnection = new MultiEndpointsConnection([
  {
    url: 'https://solana-mainnet.rpc.extrnode.com/0b168b32-7c4d-4268-b738-6fc3c4af9d76',
    weight: 2,
  },
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
  refresh: () => void
} {
  const connection = useConnection()

  const fetcher = useCallback(
    () => (publicKey ? connection.getAccountInfo(publicKey) : null),
    [publicKey]
  )

  const { data, error, mutate } = useSWR(
    `userAccountInfo_${publicKey?.toBase58()}`,
    fetcher,
    {
      refreshInterval: 10_000,
    }
  )

  return {
    data,
    isLoading: !data,
    error,
    refresh: mutate,
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
