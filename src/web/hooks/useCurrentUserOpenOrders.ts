import { OpenOrders } from '@project-serum/serum'
import { useCallback } from 'react'
import useSwr from 'swr'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { DEX_PID } from '@core/config/dex'

export const useCurrentUserOpenOrders = (): [OpenOrders[], () => void] => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = useCallback(
    () => OpenOrders.findForOwner(connection, wallet.publicKey, DEX_PID),
    [wallet, connection]
  )

  const { data, mutate } = useSwr(
    `open-orders-${wallet.publicKey?.toString()}`,
    fetcher
  )

  return [data || [], mutate]
}
