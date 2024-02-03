import React, { useState, useEffect } from 'react'

import { Redirect } from '@sb/components/Redirect'

import { Metrics } from '@core/utils/metrics'

const restrictedContriesCodes: string[] = []

export const getRegionData = async () => {
  try {
    const result = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
      .then((res) => {
        return res.text()
      })
      .then((data) => {
        const result = data
          .trim()
          .split('\n')
          .reduce(function (obj: any, pair: string) {
            const splittedPair = pair.split('=')
            obj[splittedPair[0]] = splittedPair[1]
            return obj
          }, {})

        if (restrictedContriesCodes.includes(result.loc)) {
          Metrics.sendMetrics({
            metricName: `user.restricted_region_access.${result.loc}`,
          })
          return true
        }

        return false
      })
    return result
  } catch (e) {
    console.error('getRegionData error:', e)
    return false
    // await sleep(2000).then(() => {
    //   getRegionData({ setIsFromRestrictedRegion })
    // })
  }
}

export function withRegionCheck(Component: React.ComponentType<any>) {
  return function RegionCheckComponent(props: any) {
    const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
      useState<boolean>(false)

    useEffect(() => {
      const getIsRegionRestricted = async () => {
        const isRegionRestricted = await getRegionData()
        setIsFromRestrictedRegion(isRegionRestricted)
      }
      getIsRegionRestricted()
    }, [setIsFromRestrictedRegion])

    if (isFromRestrictedRegion) {
      return <Redirect to="/restrictedRegion" />
    }

    return <Component {...props} />
  }
}
