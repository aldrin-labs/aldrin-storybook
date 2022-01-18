interface CheckIsPoolStableParams {
  curveType: number | null
}

export const checkIsPoolStable = (
  params?: CheckIsPoolStableParams
): boolean => {
  if (!params) return false

  const { curveType } = params

  if (curveType === 1) return true
  return false
}
