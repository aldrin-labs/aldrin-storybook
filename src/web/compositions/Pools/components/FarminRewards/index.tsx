import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { getTokenName } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { PoolStatsText } from '../PoolPage/styles'
import {
  FarmingIconWrap,
  FarmingDataIcons,
  FarmingText,
  Container,
} from './styles'
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
            <TokenIcon mint={mint} />
          </FarmingIconWrap>
        )
      })}
    </FarmingDataIcons>
  )
}

export const FarmingRewards: React.FC<FarmingRewardsProps> = (props) => {
  const {
    farmingUsdValue,
    pool: { poolTokenMint },
    farm,
    farmer,
  } = props

  const tokenMap = useTokenInfos()

  const openFarmingsKeys =
    farm?.harvests.map((harvest) => harvest.mint.toString()) || []
  return farm ? (
    <>
      <FarmingRewardsIcons poolMint={poolTokenMint} mints={openFarmingsKeys} />
      <Container>
        <FarmingText>
          {openFarmingsKeys.map((farmingStateMint, i) => {
            // const rewardPerK = (farmingsMap.get(farmingStateMint) || []).reduce(
            //   (acc, farmingState) => {
            //     return (
            //       acc +
            //       getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity({
            //         farmingState,
            //         totalStakedLpTokensUSD: farmingUsdValue,
            //       })
            //     )
            //   },
            //   0
            // )
            const rewardPerK = 0

            const tokenName = getTokenName({
              address: farmingStateMint,
              tokensInfoMap: tokenMap,
            })
            return (
              <FarmingText
                key={`fs_reward_${poolTokenMint}_${farmingStateMint}`}
              >
                {i > 0 ? ' + ' : ''}
                <FarmingText color="ggreen3reen0">
                  {stripByAmountAndFormat(rewardPerK)}&nbsp;
                </FarmingText>
                {tokenName}
              </FarmingText>
            )
          })}{' '}
          / Day
        </FarmingText>
        <div>
          <FarmingText>
            Per each <FarmingText color="green3">$1000</FarmingText>
          </FarmingText>
        </div>
      </Container>
    </>
  ) : (
    <div>
      <PoolStatsText>
        <InlineText>–</InlineText>
      </PoolStatsText>
    </div>
  )
}
