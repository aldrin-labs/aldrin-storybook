import { PoolsBalancesMapType, GetAccountInfoJsonResponse } from './types'

export const getPoolsBalancesMapByResponse = (
  poolBaseQuoteTokenAccountsData: GetAccountInfoJsonResponse[]
): PoolsBalancesMapType => {
  const poolBalancesMap: PoolsBalancesMapType =
    poolBaseQuoteTokenAccountsData.reduce((acc: PoolsBalancesMapType, el) => {
      const infoData = el.data.parsed.info
      const poolAddress = infoData.owner
      const { mint } = infoData

      if (acc[poolAddress]) {
        acc[poolAddress] = { ...acc[poolAddress], [mint]: infoData }
      } else {
        acc[poolAddress] = { [mint]: infoData }
      }

      return acc
    }, {})

  return poolBalancesMap
}
