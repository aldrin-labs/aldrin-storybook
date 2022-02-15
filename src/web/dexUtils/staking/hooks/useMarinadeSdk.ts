import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { useMemo } from 'react'

import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useMarinadeSdk = () => {
  const connection = useConnection()
  const { wallet } = useWallet()

  const marinade = useMemo(
    () =>
      new Marinade(
        new MarinadeConfig({ connection, publicKey: wallet.publicKey })
      ),
    [wallet.publicKey?.toString()]
  )

  return marinade
}
