import { PLUTONIANS_STAKING_POOL_ADDRESS } from '../../ProgramsMultiton'
import { useSrinStakingPools } from './useSrinStakingPools'

export const usePlutoniansStaking = () => {
  const pools = useSrinStakingPools()
  return {
    ...pools,
    data: pools.data?.find(
      (p) => p.stakingPool.toString() === PLUTONIANS_STAKING_POOL_ADDRESS
    ),
  }
}
