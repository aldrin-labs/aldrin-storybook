import { ProgramAccount } from '@project-serum/anchor'
import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import {
  PLUTONIANS_STAKING_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import {
  SRinStakingPool,
  SRinStakingPoolUI,
  SRinStakingTier,
  SRinNftRewardGroup,
} from './types'

export const useSrinStakingPools = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async (): Promise<SRinStakingPoolUI[]> => {
    try {
      const program = ProgramsMultiton.getProgramByAddress({
        programAddress: PLUTONIANS_STAKING_ADDRESS,
        wallet,
        connection,
      })
      const [pools, tiers, nftRewards] = await Promise.all([
        program.account.stakingPool.all() as Promise<
          ProgramAccount<SRinStakingPool>[]
        >,
        program.account.stakingTier.all() as Promise<
          ProgramAccount<SRinStakingTier>[]
        >,
        program.account.nftRewardGroup.all() as Promise<
          ProgramAccount<SRinNftRewardGroup>[]
        >,
      ])

      console.log('tiers: ', tiers)

      const tiersByKey = toMap(tiers, (t) => t.publicKey.toString())
      const nftRewardsByKey = toMap(nftRewards, (t) => t.publicKey.toString())
      const poolsWithTiers = pools.map((p) => ({
        ...p.account,
        stakingPool: p.publicKey,
        tiers: p.account.tiers
          .map((t) => {
            const tier = tiersByKey.get(t.toString())
            if (!tier) {
              console.warn(
                'No tier for pool: pool ',
                p.publicKey.toString(),
                '  tier: ',
                t.toString()
              )
              throw new Error('Inconsistent data: tier for pool not found!')
            }
            return {
              ...tier,
              account: {
                ...tier.account,
                nftRewardGroupsData: tier.account.nftRewardGroups
                  .map((nrg) => nftRewardsByKey.get(nrg.toString()))
                  .filter((g): g is ProgramAccount<SRinNftRewardGroup> => !!g),
              },
            }
          })
          .sort((a, b) => b.account.lockDuration.cmp(a.account.lockDuration)),
      }))
      return poolsWithTiers
    } catch (e) {
      console.warn('Unable to load pools: ', e)
      return []
    }
  }
  return useSWR(`srin-staking-pools`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
}
