import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import tuple from 'immutable-tuple'
import { useContext, useRef } from 'react'

import {
  getProviderNameFromUrl,
  AldrinConnection,
  MAINNET_BETA_ENDPOINT,
  ConnectionContext,
  ConnectionProvider,
  useConnection,
} from '@core/solana'

import { useAsyncData } from './fetch-loop'

export { MAINNET_BETA_ENDPOINT, ConnectionProvider, useConnection }

export const useMultiEndpointConnection = useConnection

export function useSerumConnection(): Connection {
  return useContext(ConnectionContext)
    .serumConnection as unknown as AldrinConnection
}

export function useConnectionConfig() {
  const ctx = useContext(ConnectionContext)
  return { endpoint: ctx.endpoint, setEndpoint: ctx.setEndpoint }
}

export function useAccountInfo(
  publicKey: PublicKey | undefined | null
): [AccountInfo<Buffer> | null | undefined, boolean] {
  const connection = useConnection()
  const cacheKey = tuple('useAccountInfo', publicKey?.toBase58())
  const [accountInfo, loaded] = useAsyncData(
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

export { getProviderNameFromUrl }
