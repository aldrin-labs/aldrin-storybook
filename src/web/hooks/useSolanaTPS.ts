import useSWR from 'swr'

import { useSerumConnection } from '@sb/dexUtils/connection'

const MINUTES_TO_CHECK_PERFORMANCE = 6

export const useSolanaTPS = () => {
  const connection = useSerumConnection()

  const fetcher = async () => {
    const recentPerformanceSamples = await connection.getRecentPerformanceSamples(MINUTES_TO_CHECK_PERFORMANCE)

    const avgTPS =
      recentPerformanceSamples.reduce((acc, sample) => {
        const avgPeriodTPS = sample.numTransactions / sample.samplePeriodSecs
        return acc + avgPeriodTPS
      }, 0) / MINUTES_TO_CHECK_PERFORMANCE

    return avgTPS
  }

  return useSWR('solanaTPS', fetcher)
}
