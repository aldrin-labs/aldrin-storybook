import { Jupiter, RouteInfo } from '@jup-ag/core'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { getSwapRoute } from './utils'

export type UseJupiterSwapRouteProps = {
  inputMint?: string
  outputMint?: string
  slippage?: number
  inputMintDecimals?: number
  inputAmount?: number
}

export type UseJupiterSwapRouteResponse = {
  jupiter: Jupiter | null
  route: RouteInfo | null
  loading: boolean
  refresh: () => Promise<void>
}

export const useJupiterSwapRoute = ({
  inputMint,
  outputMint,
  inputAmount = 0,
  slippage = 0,
  inputMintDecimals,
}: UseJupiterSwapRouteProps): UseJupiterSwapRouteResponse => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [jupiter, setJupiter] = useState<Jupiter | null>(null)
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJupiter = async () => {
      if (wallet.publicKey && wallet.publicKey.toString()) {
        const jupiterInstance = await Jupiter.load({
          connection,
          cluster: 'mainnet-beta',
          user: Keypair.fromSecretKey(
            Buffer.from([
              64, 240, 122, 164, 9, 144, 122, 28, 112, 33, 31, 50, 149, 249, 59,
              97, 27, 199, 15, 103, 144, 137, 72, 1, 209, 35, 75, 151, 130, 173,
              207, 107, 6, 216, 96, 183, 211, 127, 188, 93, 195, 237, 239, 100,
              152, 68, 130, 26, 133, 90, 45, 22, 162, 172, 55, 58, 221, 28, 115,
              22, 16, 74, 149, 222,
            ])
          ), // or public key
        })

        setJupiter(jupiterInstance)
      }
    }

    loadJupiter()
  }, [wallet.publicKey?.toString()])

  const refreshArgs = [
    jupiter,
    slippage,
    inputAmount,
    inputMint,
    outputMint,
    inputMintDecimals,
  ]

  const refresh = useCallback(async () => {
    if (jupiter) {
      setLoading(true)

      const swapRoute = await getSwapRoute({
        jupiter,
        slippage,
        inputAmount,
        inputMint: inputMint ? new PublicKey(inputMint) : undefined,
        outputMint: outputMint ? new PublicKey(outputMint) : undefined,
        inputMintDecimals,
      })

      setRoute(swapRoute)
      setLoading(false)
    }
  }, refreshArgs)

  useEffect(() => {
    refresh()
  }, refreshArgs)

  return { jupiter, route, refresh, loading }
}
