export * from '@core/utils/swap/config'

export const getLiquidityProviderFee = (curveType: number | null) =>
  curveType === 1 ? 0.038 : 0.3
