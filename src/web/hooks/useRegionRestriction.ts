import useSWR from 'swr'

import { getRegionData } from '@sb/hoc'

export const useRegionRestriction = () => {
  const fetcher = async () => {
    const isRegionRestricted = await getRegionData()
    return isRegionRestricted
  }

  return useSWR('region-restriction', fetcher)
}
