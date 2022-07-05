import React from 'react'

import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { LiquidityText } from '../PoolPage/styles'

interface UserFarmingRewardsProps {
  availableToClaim: {
    name: string
    mint: string
    usdValue: number
    amount: number
  }[]
}

export const UserFarmingRewards: React.FC<UserFarmingRewardsProps> = (
  props
) => {
  const { availableToClaim } = props

  const availableToClaimUsd = availableToClaim.reduce(
    (acc, atc) => acc + atc.usdValue,
    0
  )

  return (
    <>
      <div>
        <LiquidityText weight={600}>
          {availableToClaim.map((atc, idx) => (
            <React.Fragment key={`farming_available_to_claim_${atc.mint}`}>
              {idx !== 0 ? ' + ' : ''}
              <LiquidityText color="green7">
                {stripByAmountAndFormat(atc.amount, 6)}
              </LiquidityText>
              &nbsp;
              {getTokenNameByMintAddress(atc.mint)}
            </React.Fragment>
          ))}
        </LiquidityText>
      </div>
      <div>
        <LiquidityText color="green7">
          ${stripByAmountAndFormat(availableToClaimUsd, 2)}
        </LiquidityText>
      </div>
    </>
  )
}
