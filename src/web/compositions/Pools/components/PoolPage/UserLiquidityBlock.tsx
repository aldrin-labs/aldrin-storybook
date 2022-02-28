import dayjs from 'dayjs'
import React from 'react'


import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
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
  } = props

  const { amount } = getTokenDataByMint(userTokensData, pool.poolTokenMint)

  // Hide tiny balances (we cannot withdraw all LP tokens so...)
  const poolTokenAmount =
    amount <= MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ? 0 : amount

  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)

  const vestingFinishTs = (vesting?.endTs || 0) * 1000
  const vestingFinished = vestingFinishTs <= Date.now()
  const vestedTokens = parseFloat(vesting?.outstanding.toString() || '0')
  const [baseUserTokenAmount, quoteUserTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount: poolTokenAmount + stakedTokens + vestedTokens,
  })

  const availableTowithdraw =
    poolTokenAmount + stakedTokens + (vestingFinished ? vestedTokens : 0)

  const baseTokenName = getTokenNameByMintAddress(pool.tokenA)
  const quoteTokenName = getTokenNameByMintAddress(pool.tokenB)

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
            <LiquidityText color="success">
              {stripByAmountAndFormat(baseUserTokenAmount, 6)}
            </LiquidityText>{' '}
            {baseTokenName}
            <LiquidityText color="success">
              {' '}
              / {stripByAmountAndFormat(quoteUserTokenAmount, 6)}
            </LiquidityText>{' '}
            {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">
            ${stripByAmountAndFormat(userLiquidityUsd, 2)}
          </LiquidityText>
        </div>
        <LiquidityButton
          disabled={processing}
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
            <LiquidityText color="success">
              {stripByAmountAndFormat(earnedPoolFees.totalBaseTokenFee, 6)}
            </LiquidityText>{' '}
            {baseTokenName}
            <LiquidityText color="success">
              {' '}
              /{stripByAmountAndFormat(earnedPoolFees.totalQuoteTokenFee, 6)}
            </LiquidityText>{' '}
            {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">
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
