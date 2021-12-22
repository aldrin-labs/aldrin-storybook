import React from 'react'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { LiquidityText } from '../PoolPage/styles'

interface UserFarmingRewardsProps {
  availableToClaim: {
    name: string
    farmingTokenMint: string
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
            <React.Fragment
              key={`farming_available_to_claim_${atc.farmingTokenMint}`}
            >
              {idx !== 0 ? ' + ' : ''}
              <LiquidityText color="success">
                {stripByAmountAndFormat(atc.amount, 6)}
              </LiquidityText>
              &nbsp;
              {getTokenNameByMintAddress(atc.farmingTokenMint)}
            </React.Fragment>
          ))}
        </LiquidityText>
      </div>
      <div>
        <LiquidityText color="success">
          ${stripByAmountAndFormat(availableToClaimUsd, 2)}
        </LiquidityText>
      </div>
    </>
  )
}
