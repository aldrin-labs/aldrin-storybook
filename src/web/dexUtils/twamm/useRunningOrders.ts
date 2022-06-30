import { Connection } from '@solana/web3.js'
import { useState, useCallback, useEffect } from 'react'

import { AsyncRefreshFunction, WalletAdapter } from '../types'
import { getParsedRunningOrders } from './getParsedRunningOrders'
import { TwammOrder } from './types'

export const useRunningOrders = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [TwammOrder[], AsyncRefreshFunction] => {
  const [runningOrders, setRunningOrders] = useState<TwammOrder[]>([])

  const loadRunningOrders = useCallback(async () => {
    if (wallet.publicKey?.toString()) {
      const running = await getParsedRunningOrders({ wallet, connection })

      setRunningOrders(running)
    }

    return true
  }, [wallet.publicKey?.toString()])

  useEffect(() => {
    loadRunningOrders()
  }, [wallet.publicKey?.toString()])

  return [runningOrders, loadRunningOrders]
}
