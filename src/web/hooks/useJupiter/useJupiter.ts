import { Jupiter } from '@jup-ag/core'
import { useEffect, useState } from 'react'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

export const useJupiter = (): Jupiter | null => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [jupiter, setJupiter] = useState<Jupiter | null>(null)

  useEffect(() => {
    const loadJupiter = async () => {
      const jupiterInstance = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: wallet.publicKey ?? undefined, // or public key
      })

      setJupiter(jupiterInstance)
    }

    loadJupiter()
  }, [wallet.publicKey?.toString()])

  return jupiter
}
