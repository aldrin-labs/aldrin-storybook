import useSWR from 'swr'

import { Harvest } from '@core/solana'
import { calculateAPR } from '@core/solana/programs/farming/calculateAPR'

import { useConnection } from '../../connection'

export const useRinStakingApr = ({
  totalStaked,
  harvest,
}: {
  totalStaked: number
  harvest: Harvest
}) => {
  const connection = useConnection()
  const fetcher = async () => {
    const apr = calculateAPR({ totalStaked, harvest, connection })
    return apr
  }

  return useSWR(`rin-staking-apr`, fetcher)
}
