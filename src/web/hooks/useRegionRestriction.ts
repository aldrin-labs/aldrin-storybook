import useSWR from 'swr'

import { getRegionData } from '@sb/hoc'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

export const useRegionRestriction = () => {
  const fetcher = async () => {
    const isRegionRestricted = await getRegionData()
    return isRegionRestricted
  }

  const { data: isRegionRestricted } = useSWR('region-restriction', fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })

  return isRegionRestricted
}
