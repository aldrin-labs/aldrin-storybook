import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { useConnection } from '../../connection'
import { MARINADE_REF_ADDRESS } from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'

export const useMarinadeSdk = () => {
  const connection = useConnection()
  const { wallet } = useWallet()

  const marinade = useMemo(
    () =>
      new Marinade(
        new MarinadeConfig({
          connection,
          publicKey: wallet.publicKey,
          referralCode: new PublicKey(MARINADE_REF_ADDRESS),
        })
      ),
    [wallet.publicKey?.toString()]
  )

  return marinade
}
