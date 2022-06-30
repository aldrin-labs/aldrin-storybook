export * from '@core/solana/programs/ammPools/utils'

export const getLiquidityProviderFee = (curveType: number | null) =>
  curveType === 1 ? 0.038 : 0.3
