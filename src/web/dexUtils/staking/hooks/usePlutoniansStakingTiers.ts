import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useConnection } from '../../connection'
import {
  PLUTONIANS_STAKING_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'

export const usePlutoniansStakingTiers = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async () => {
    const program = ProgramsMultiton.getProgramByAddress({
      programAddress: PLUTONIANS_STAKING_ADDRESS,
      wallet,
      connection,
    })
    const pools = await program.account.stakingPool.all()
    console.log('pools: ', pools)
    return pools
  }
  return useSWR('plutonians-staking-tiers', fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
}
