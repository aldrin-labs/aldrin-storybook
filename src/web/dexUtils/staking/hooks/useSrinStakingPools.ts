import { ProgramAccount } from '@project-serum/anchor'
import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { groupBy, toMap } from '../../../utils'
import { useConnection } from '../../connection'
import {
  PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import {
  SRinStakingPool,
  SRinStakingPoolUI,
  SRinStakingTier,
  SRinNftRewardGroup,
  SRinStakeToRewardConversionPath,
} from './types'

const HIDE_TIERS = ['EhMoc44x7GjGadBaFf1CM6GZzJVKSGotwxovrcwsnQek']

export const useSrinStakingPools = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async (): Promise<SRinStakingPoolUI[]> => {
    try {
      const program = ProgramsMultiton.getProgramByAddress({
        programAddress: PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
        wallet,
        connection,
      })

      const [pools, tiers, nftRewards, paths] = await Promise.all([
        program.account.stakingPool.all() as Promise<
          ProgramAccount<SRinStakingPool>[]
        >,
        program.account.stakingTier.all() as Promise<
          ProgramAccount<SRinStakingTier>[]
        >,
        program.account.nftTierReward.all() as Promise<
          ProgramAccount<SRinNftRewardGroup>[]
        >,
        program.account.stakeToRewardConversionPath.all() as Promise<
          ProgramAccount<SRinStakeToRewardConversionPath>[]
        >,
      ])

      const tiersByKey = toMap(
        tiers.filter((t) => !HIDE_TIERS.includes(t.publicKey.toString())),
        (t) => t.publicKey.toString()
      )
      const nftRewardsByTier = groupBy(nftRewards, (t) =>
        t.account.tier.toString()
      )
      const poolsWithTiers = pools.map((p) => ({
        ...p.account,
        stakingPool: p.publicKey,
        stakeToRewardConversionPath: paths.find((path) =>
          path.account.stakingPool.equals(p.publicKey)
        ),
        tiers: p.account.tiers
          .filter((t) => !HIDE_TIERS.includes(t.toString()))
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
              nftRewards: nftRewardsByTier.get(t.toString()) || [],
            }
          })
          .sort((a, b) =>
            b.account.lockDuration.seconds.cmp(a.account.lockDuration.seconds)
          ),
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
