import { PLUTONIANS_STAKING_POOL_ADDRESS } from '@core/solana'

import { useSrinStakingPools } from './useSrinStakingPools'

export const usePlutoniansStaking = (
  stakingPool = PLUTONIANS_STAKING_POOL_ADDRESS
) => {
  const pools = useSrinStakingPools()

  return {
    ...pools,
    data: pools.data?.find((p) => p.stakingPool.toString() === stakingPool),
  }
}
