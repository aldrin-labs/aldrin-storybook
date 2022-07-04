import BN from 'bn.js'
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

const ZERO = new BN(0)
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

  const openFarmings =
    farm?.harvests.filter(
      (h) => h.periods.length === 1 && h.periods[0].tps.amount.gt(ZERO)
    ) || []

  const openFarmingsKeys = openFarmings.map((harvest) =>
    harvest.mint.toString()
  )

  if (farm) {
    console.log('openFarmingsKeys:', farm)
  }
  return openFarmings.length > 0 ? (
    <>
      <FarmingRewardsIcons poolMint={poolTokenMint} mints={openFarmingsKeys} />
      <Container>
        <FarmingText>
          {openFarmings.map((harvest, i) => {
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
            const address = harvest.mint.toString()

            const tokenName = getTokenName({
              address,
              tokensInfoMap: tokenMap,
            })
            return (
              <FarmingText key={`fs_reward_${poolTokenMint}_${address}`}>
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
