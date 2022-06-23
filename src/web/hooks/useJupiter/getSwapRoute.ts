import { Jupiter } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'

import { AMMS_TO_USE } from './config'

export const getSwapRoute = async ({
  jupiter,
  inputMint,
  inputMintDecimals,
  outputMint,
  inputAmount,
  slippage,
}: {
  jupiter: Jupiter
  inputMint?: PublicKey
  inputMintDecimals?: number
  outputMint?: PublicKey
  inputAmount: number
  slippage: number
}) => {
  try {
    if (!jupiter || !inputMint || !outputMint) {
      return null
    }

    const inputAmountInSmallestUnits = inputMintDecimals ? Math.round(inputAmount * 10 ** inputMintDecimals) : 0
    const routes =
      inputMint && outputMint
        ? await jupiter.computeRoutes({
            inputMint: new PublicKey(inputMint),
            outputMint: new PublicKey(outputMint),
            inputAmount: inputAmountInSmallestUnits, // raw input amount of tokens
            slippage,
          })
        : null

    const filteredRoutes =
      routes && routes.routesInfos
        ? routes.routesInfos.filter((route) =>
            route.marketInfos.every((marketInfo) => AMMS_TO_USE.includes(marketInfo.marketMeta.amm.label))
          )
        : []

    return filteredRoutes[0]
  } catch (error) {
    console.log('error', error)
    throw error
  }
}
