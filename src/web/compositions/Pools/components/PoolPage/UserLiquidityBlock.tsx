import { FarmingTicket } from '@sb/dexUtils/common/types'
import { TokenInfo } from '@sb/dexUtils/types'
import React from 'react'
import { PoolInfo, FeesEarned } from '../../index.types'
import { getTokenDataByMint } from '../../utils'
import { LiquidityBlock, LiquidityButton, LiquidityItem, LiquidityText, LiquidityTitle } from './styles'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

interface UserLiquidityBlockProps {
  pool: PoolInfo
  userTokensData: TokenInfo[]
  farmingTickets: Map<string, FarmingTicket[]>
  earnedFees: Map<string, FeesEarned>
  basePrice: number
  quotePrice: number
  processing: boolean
  onDepositClick: () => void
  onWithdrawClick: () => void
}

export const UserLiquidityBlock: React.FC<UserLiquidityBlockProps> = (props) => {

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
  } = props

  const { amount: poolTokenAmount } = getTokenDataByMint(userTokensData, pool.poolTokenMint)

  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []


  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)

  const hasLiquidity = stakedTokens > 0 || poolTokenAmount > 0

  const [baseUserTokenAmount, quoteUserTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount: poolTokenAmount + stakedTokens,
  })

  const baseTokenName = getTokenNameByMintAddress(pool.tokenA)
  const quoteTokenName = getTokenNameByMintAddress(pool.tokenB)

  const userLiquidityUsd = basePrice * baseUserTokenAmount + quotePrice * quoteUserTokenAmount

  const earnedPoolFees = earnedFees.get(pool.swapToken) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

  const earnedFeesUd = earnedPoolFees.totalBaseTokenFee * basePrice + earnedPoolFees.totalQuoteTokenFee * quotePrice

  return (
    <LiquidityBlock>
      <LiquidityItem>
        <LiquidityTitle>Your Liquidity:</LiquidityTitle>
        <div>
          <LiquidityText weight={600}>
            <LiquidityText color="success">{stripByAmountAndFormat(baseUserTokenAmount, 6)}</LiquidityText> {baseTokenName}
            <LiquidityText color="success"> / {stripByAmountAndFormat(quoteUserTokenAmount, 6)}</LiquidityText> {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">${stripByAmountAndFormat(userLiquidityUsd, 2)}</LiquidityText>
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
            <LiquidityText color="success">{stripByAmountAndFormat(earnedPoolFees.totalBaseTokenFee, 6)}</LiquidityText>  {baseTokenName}
            <LiquidityText color="success"> /{stripByAmountAndFormat(earnedPoolFees.totalQuoteTokenFee, 6)}</LiquidityText> {quoteTokenName}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">${stripByAmountAndFormat(earnedFeesUd, 2)}</LiquidityText>
        </div>
        <LiquidityButton
          disabled={processing || !hasLiquidity}
          onClick={onWithdrawClick}
          $loading={processing}
        >
          Withdraw Liquidity + Fees
        </LiquidityButton>

      </LiquidityItem>
    </LiquidityBlock>
  )
}