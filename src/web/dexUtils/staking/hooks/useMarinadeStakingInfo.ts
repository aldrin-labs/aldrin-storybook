import useSWR from 'swr'

import { useConnection } from '../../connection'
import { MarinadeStats } from './types'

export const useMarinadeStakingInfo = () => {
  const connection = useConnection()

  const fetcher = async () => {
    const stats = await fetch('/marinade/stats.json')
    const statsBody = (await stats.json()) as MarinadeStats

    const epochInfo = await connection.getEpochInfo()

    const epochPct = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100
    return { stats: statsBody, epochInfo: { ...epochInfo, epochPct } }
  }

  return useSWR('marinade-pool-full-info', fetcher, {
    refreshInterval: 60_000,
  })
}
