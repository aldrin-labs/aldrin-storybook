import React, { useState, useEffect } from 'react'

import { Redirect } from '@sb/components/Redirect'

import { sleep } from '@core/utils/helpers'
import { Metrics } from '@core/utils/metrics'

const restrictedContriesCodes = ['IR', 'KP', 'YE', 'VE', 'YV', 'SD', 'SO']

const getRegionData = async ({
  setIsFromRestrictedRegion,
}: {
  setIsFromRestrictedRegion: (value: boolean) => void
}) => {
  try {
    await fetch('https://www.cloudflare.com/cdn-cgi/trace')
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
          setIsFromRestrictedRegion(true)
        }
      })
  } catch (e) {
    console.error('getRegionData error:', e)
    await sleep(2000).then(() => {
      getRegionData({ setIsFromRestrictedRegion })
    })
  }
}

export function withRegionCheck(Component: React.ComponentType<any>) {
  return function RegionCheckComponent(props: any) {
    const [isFromRestrictedRegion, setIsFromRestrictedRegion] =
      useState<boolean>(false)

    useEffect(() => {
      getRegionData({ setIsFromRestrictedRegion })
    }, [setIsFromRestrictedRegion])

    if (isFromRestrictedRegion) {
      return <Redirect to="/restrictedRegion" />
    }

    return <Component {...props} />
  }
}
