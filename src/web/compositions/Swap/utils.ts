import { Jupiter } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'

const AMMS_TO_USE = ['Serum']

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

    const inputAmountInSmallestUnits = inputMintDecimals
      ? Math.round(inputAmount * 10 ** inputMintDecimals)
      : 0
    const routes =
      inputMint && outputMint
        ? await jupiter.computeRoutes(
            new PublicKey(inputMint),
            new PublicKey(outputMint),
            inputAmountInSmallestUnits, // raw input amount of tokens
            slippage,
            true
          )
        : null

    const filteredRoutes =
      routes && routes.routesInfos
        ? routes.routesInfos.filter((route) =>
            route.marketInfos.every((marketInfo) =>
              AMMS_TO_USE.includes(marketInfo.marketMeta.amm.label)
            )
          )
        : []

    return filteredRoutes[0]
  } catch (error) {
    console.log('error', error)
    throw error
  }
}
