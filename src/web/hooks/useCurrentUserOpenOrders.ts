import { OpenOrders } from '@project-serum/serum'
import { useCallback } from 'react'
import useSwr from 'swr'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { useMarket } from '../dexUtils/markets'

export const useCurrentUserOpenOrders = (): [OpenOrders[], () => void] => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const { market } = useMarket()

  const fetcher = useCallback(() => {
    if (market && market._programId && wallet?.publicKey) {
      return OpenOrders.findForOwner(
        connection,
        wallet.publicKey,
        market._programId
      )
    }
  }, [wallet, connection])

  const { data, mutate } = useSwr(
    `open-orders-${market?._programId}${wallet.publicKey?.toString()}`,
    fetcher
  )

  return [data || [], mutate]
}
