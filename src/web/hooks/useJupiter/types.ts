import { Jupiter, RouteInfo, TransactionFeeInfo } from '@jup-ag/core'

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
  inputAmount: number | string
  outputAmount: number | string
  depositAndFee: TransactionFeeInfo | undefined | null
  setInputAmount: (newOutputAmount: number | string, inputMintFromArgs?: string, outputMintFromArgs?: string) => void
  refresh: () => Promise<void>
}
