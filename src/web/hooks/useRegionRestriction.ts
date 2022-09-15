import { useState } from 'react'
import useSWR from 'swr'

import { getRegionData } from '@sb/hoc'

export const useRegionRestriction = () => {
  const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
    useState<boolean>(false)

  const fetcher = async () => {
    getRegionData({ setIsFromRestrictedRegion })
    return isFromRestrictedRegion
  }

  return useSWR('region-restriction', fetcher)
}
 