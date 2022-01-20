export const SLIPPAGE_PERCENTAGE = 0.3
export const getLiquidityProviderFee = (curveType: number | null) =>
  curveType === 1 ? 0.038 : 0.3

export const getSwapButtonText = ({
  isTokenABalanceInsufficient,
  baseSymbol,
  isSwapRouteExists,
  needEnterAmount,
}: {
  isTokenABalanceInsufficient: boolean
  baseSymbol: string
  isSwapRouteExists: boolean
  needEnterAmount: boolean
}) => {
  if (isTokenABalanceInsufficient) {
    return `Insufficient ${baseSymbol} Balance`
  }

  if (!isSwapRouteExists) {
    return 'No route for swap'
  }
  if (needEnterAmount) {
    return 'Enter amount'
  }

  return 'Swap'
}
