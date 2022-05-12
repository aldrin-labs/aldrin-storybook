import { PLUTONIANS_STAKING_POOL_ADDRESS } from '../../ProgramsMultiton'
import { useSrinStakingPools } from './useSrinStakingPools'

export const usePlutoniansStaking = (
  poolAddress = PLUTONIANS_STAKING_POOL_ADDRESS
) => {
  const pools = useSrinStakingPools()

  return {
    ...pools,
    data: pools.data?.find((p) => p.stakingPool.toString() === poolAddress),
  }
}
