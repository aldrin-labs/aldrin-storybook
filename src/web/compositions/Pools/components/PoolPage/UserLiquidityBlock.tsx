import dayjs from 'dayjs'
import React from 'react'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'
import { getTokenName } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { useRegionRestriction } from '@sb/hooks/useRegionRestriction'

import { getStakedTokensTotal } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { getTokenDataByMint } from '../../utils'
import {
  LiquidityBlock,
  LiquidityButton,
  LiquidityItem,
  LiquidityText,
  LiquidityTitle,
} from './styles'
import { UserLiquidityBlockProps } from './types'

export const UserLiquidityBlock: React.FC<UserLiquidityBlockProps> = (
  props
) => {
  const {
    userTokensData,
    pool,
    farmingTickets: farmingTicketsMap,
    basePrice,
    quotePrice,
    earnedFees,
    onDepositClick,
    onWithdrawClick,
    processing,
    vesting,
    tokenMap,
  } = props

  const { data: isRegionRestricted } = useRegionRestriction()
  console.log({ isRegionRestricted })
  const { amount } = getTokenDataByMint(userTokensData, pool.poolTokenMint)

  // Hide tiny balances (we cannot withdraw all LP tokens so...)
  const poolTokenAmount =
    amount <= MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ? 0 : amount

  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

  const stakedTokens = getStakedTokensTotal(farmingTickets)

  const vestingFinishTs = (vesting?.endTs || 0) * 1000
  const vestingFinished = vestingFinishTs <= Date.now()
  const vestedTokens = parseFloat(vesting?.outstanding.toString() || '0')
  const [baseUserTokenAmount, quoteUserTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount: poolTokenAmount + stakedTokens + vestedTokens,
  })

  const availableTowithdraw =
    poolTokenAmount + stakedTokens + (vestingFinished ? vestedTokens : 0)

  const baseTokenName = getTokenName({
    address: pool.tokenA,
    tokensInfoMap: tokenMap,
  })
  const quoteTokenName = getTokenName({
    address: pool.tokenB,
    tokensInfoMap: tokenMap,
  })

  const userLiquidityUsd =
    basePrice * baseUserTokenAmount + quotePrice * quoteUserTokenAmount

  const earnedPoolFees = earnedFees.get(pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const earnedFeesUd =
    earnedPoolFees.totalBaseTokenFee * basePrice +
    earnedPoolFees.totalQuoteTokenFee * quotePrice

  return (
    <LiquidityBlock>
      <LiquidityItem>
        <LiquidityTitle>Your Liquidity:</LiquidityTitle>
        <div>
          <LiquidityText weight={600}>
            <LiquidityText color="green7">
              {stripByAmountAndFormat(baseUserTokenAmount, 6)}
            </LiquidityText>{' '}
            {baseTokenName}
            <LiquidityText color="green7">
              {' '}
              / {stripByAmountAndFormat(quoteUserTokenAmount, 6)}
            </LiquidityText>{' '}
            {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="green7">
            ${stripByAmountAndFormat(userLiquidityUsd, 2)}
          </LiquidityText>
        </div>
        <LiquidityButton
          disabled={processing || isRegionRestricted}
          $loading={processing}
          $variant="rainbow"
          onClick={onDepositClick}
        >
          Deposit Liquidity
        </LiquidityButton>
      </LiquidityItem>
      <LiquidityItem>
        <LiquidityTitle>Fees Earned:</LiquidityTitle>
        <div>
          <LiquidityText weight={600}>
            <LiquidityText color="green7">
              {stripByAmountAndFormat(earnedPoolFees.totalBaseTokenFee, 6)}
            </LiquidityText>{' '}
            {baseTokenName}
            <LiquidityText color="green7">
              {' '}
              /{stripByAmountAndFormat(earnedPoolFees.totalQuoteTokenFee, 6)}
            </LiquidityText>{' '}
            {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="green7">
            ${stripByAmountAndFormat(earnedFeesUd, 2)}
          </LiquidityText>
        </div>

        <DarkTooltip
          title={
            vestingFinished
              ? null
              : `Liquidity locked until ${dayjs
                  .unix(vestingFinishTs / 1000)
                  .format('MMM DD, YYYY')} `
          }
        >
          <LiquidityButton
            disabled={processing || availableTowithdraw === 0}
            onClick={onWithdrawClick}
            $loading={processing}
          >
            Withdraw Liquidity + Fees
          </LiquidityButton>
        </DarkTooltip>
      </LiquidityItem>
    </LiquidityBlock>
  )
}
