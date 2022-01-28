export const SLIPPAGE_PERCENTAGE = 0.3
export const getLiquidityProviderFee = (curveType: number | null) =>
  curveType === 1 ? 0.038 : 0.3
