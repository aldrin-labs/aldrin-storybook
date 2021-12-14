import React from 'react'
import { TokenIcon } from '@sb/components/TokenIcon'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { InlineText } from '@sb/components/Typography'
import { FarmingIconWrap, FarmingDataIcons, FarmingText } from './styles'
import { PoolStatsText } from '../PoolPage/styles'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'

import { groupBy } from '../../../../utils'
import { FarmingRewardsIconsProps, FarmingRewardsProps } from './types'

export const FarmingRewardsIcons: React.FC<FarmingRewardsIconsProps> = (
  props
) => {
  const { mints, poolMint } = props
  return (
    <FarmingDataIcons>
      {mints.map((mint) => {
        return (
          <FarmingIconWrap key={`farming_icon_${poolMint}_${mint}`}>
            <TokenIcon mint={mint} width="1.3em" emojiIfNoLogo={false} />
          </FarmingIconWrap>
        )
      })}
    </FarmingDataIcons>
  )
}

export const FarmingRewards: React.FC<FarmingRewardsProps> = (props) => {
  const {
    farmingUsdValue,
    pool: { poolTokenMint, farming },
  } = props

  const farmings = filterOpenFarmingStates(farming || [])
  const farmingsMap = groupBy(farmings, (f) => f.farmingTokenMint)

  const openFarmingsKeys = Array.from(farmingsMap.keys())

  return farmings.length > 0 ? (
    <>
      <FarmingRewardsIcons poolMint={poolTokenMint} mints={openFarmingsKeys} />
      <div>
        <FarmingText>
          {openFarmingsKeys.map((farmingStateMint, i) => {
            const rewardPerK = (farmingsMap.get(farmingStateMint) || []).reduce(
              (acc, farmingState) => {
                return (
                  acc +
                  getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity({
                    farmingState,
                    totalStakedLpTokensUSD: farmingUsdValue,
                  })
                )
              },
              0
            )
            return (
              <FarmingText
                key={`fs_reward_${poolTokenMint}_${farmingStateMint}`}
              >
                {i > 0 ? ' + ' : ''}
                <FarmingText color="success">
                  {stripByAmountAndFormat(rewardPerK)}&nbsp;
                </FarmingText>
                {getTokenNameByMintAddress(farmingStateMint)}
              </FarmingText>
            )
          })}{' '}
          / Day
        </FarmingText>
        <div>
          <FarmingText>
            Per each <FarmingText color="success">$1000</FarmingText>
          </FarmingText>
        </div>
      </div>
    </>
  ) : (
    <div>
      <PoolStatsText>
        <InlineText>–</InlineText>
      </PoolStatsText>
    </div>
  )
}
