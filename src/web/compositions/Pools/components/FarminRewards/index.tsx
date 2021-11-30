import React from 'react'
import { FarmingState } from '@sb/dexUtils/common/types'
import { TokenIcon } from '@sb/components/TokenIcon'

import { FarmingIconWrap, FarmingDataIcons, FarmingText } from './styles'
import { PoolStatsText } from '../PoolPage/styles'
import {
  getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity,
} from '../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { PoolInfo } from '../../index.types'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'

interface FarmingRewardsProps {
  pool: PoolInfo
  farmingUsdValue: number
}

export const FarmingRewards: React.FC<FarmingRewardsProps> = (props) => {
  const { farmingUsdValue, pool: { poolTokenMint, farming } } = props

  const farmings = filterOpenFarmingStates(farming || [])
  const farmingsMap = farmings.reduce((acc, of) => {
    const fs: FarmingState[] = acc.get(of.farmingTokenMint) || []

    acc.set(of.farmingTokenMint, [...fs, of])
    return acc
  }, new Map<string, FarmingState[]>())

  const openFarmingsKeys = Array.from(farmingsMap.keys())

  return farmings.length > 0 ?
    <>
      <FarmingDataIcons>
        {openFarmingsKeys.map((farmingStateMint) => {
          return (
            <FarmingIconWrap
              key={`farming_icon_${poolTokenMint}_${farmingStateMint}`}
            >
              <TokenIcon
                mint={farmingStateMint}
                width={'1.3em'}
                emojiIfNoLogo={false}
              />
            </FarmingIconWrap>
          )
        })}
      </FarmingDataIcons>
      <div>
        <FarmingText>
          {openFarmingsKeys.map((farmingStateMint, i, arr) => {
            const rewardPerK = (farmingsMap.get(farmingStateMint) || []).reduce((acc, farmingState) => {
              return acc + getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity(
                { farmingState, totalStakedLpTokensUSD: farmingUsdValue }
              )
            }, 0)
            return (
              <FarmingText key={`fs_reward_${poolTokenMint}_${farmingStateMint}`}>
                {i > 0 ? ' + ' : ''}
                <FarmingText color="success">
                  {stripByAmountAndFormat(rewardPerK)}&nbsp;
                </FarmingText>
                {getTokenNameByMintAddress(farmingStateMint)}
              </FarmingText>
            )
          })} / Day
        </FarmingText>
        <div>
          <FarmingText>
            Per each  <FarmingText color="success">$1000</FarmingText>
          </FarmingText>
        </div>
      </div>
    </>
    :
    <div>
      <PoolStatsText>No farming</PoolStatsText>
    </div>
}