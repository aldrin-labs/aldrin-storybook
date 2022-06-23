import { PublicKey } from '@solana/web3.js'
import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import AldrinLogo from '@icons/Aldrin.svg'

import { getTokenNameByMintAddress } from '../../../../dexUtils/markets'
import { DAYS_TO_CHECK_BUY_BACK } from '../../../../dexUtils/staking/config'
import { useStakingPoolInfo } from '../../../../dexUtils/staking/hooks'
import { useAccountBalance } from '../../../../dexUtils/staking/useAccountBalance'
import {
  ContentBlock,
  GrayLink,
  Line,
  StakingBlock,
  StretchedContent,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Coins from './bg.png'
import {
  LogoWrap,
  AbsoluteImg,
  MarketcapBlock,
  Block as StatsBlock,
} from './styles'
import { RinStakingBlockProps } from './types'

const Block: React.FC<RinStakingBlockProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices },
  } = props

  const { data: poolInfo } = useStakingPoolInfo()

  const tokenName = getTokenNameByMintAddress(
    poolInfo?.currentFarmingState.farmingTokenMint
  )
  const rinPrice =
    getDexTokensPrices?.find((v) => v.symbol === tokenName)?.price || 0

  const [totalStakedRIN] = useAccountBalance({
    publicKey: poolInfo
      ? new PublicKey(poolInfo.poolInfo.stakingVault)
      : undefined,
  })

  const marketCap = rinPrice * (poolInfo?.rinCirculationSupply || 0)

  const totalStakedUsdValue = rinPrice * totalStakedRIN

  const stakedPercentage =
    (totalStakedRIN / (poolInfo?.rinCirculationSupply || totalStakedRIN)) * 100

  const buyBackAPR =
    ((poolInfo?.buyBackAmount || 0) / DAYS_TO_CHECK_BUY_BACK / totalStakedRIN) *
    365 *
    100

  const treasuryAPR =
    ((poolInfo?.treasuryDailyRewards || 0) / totalStakedRIN) * 365 * 100

  const totalApr = buyBackAPR + treasuryAPR

  return (
    <StakingBlock>
      <LogoWrap>
        <img src={AldrinLogo} height="70" alt="Aldrin" />
        <AbsoluteImg src={Coins} height="auto" alt="Aldrin" />
      </LogoWrap>
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake RIN</BlockTitle>
          <NumberWithLabel value={totalApr} label="APR" />
        </RowContainer>
        <ContentBlock>
          <RowContainer
            margin="0 0 1em 0"
            justify="space-between"
            align="flex-start"
          >
            <InlineText color="gray1" size="sm">
              Total Staked
            </InlineText>
            <InlineText size="xmd" weight={700} color="gray0">
              {totalStakedRIN
                ? stripByAmountAndFormat(totalStakedRIN, 2)
                : ' ---'}
              &nbsp;
              <InlineText color="gray1" weight={600}>
                RIN
              </InlineText>
            </InlineText>
          </RowContainer>
          <RowContainer justify="space-between">
            <InlineText size="sm">
              {stakedPercentage.toFixed(2)}% of circulating supply
            </InlineText>{' '}
            <InlineText size="sm" weight={700}>
              <InlineText color="gray1">$</InlineText>
              {totalStakedUsdValue
                ? stripByAmountAndFormat(totalStakedUsdValue, 2)
                : ' ---'}
            </InlineText>
          </RowContainer>
        </ContentBlock>
        <Line />{' '}
        <StretchedContent>
          <StatsBlock width="31%">
            <Row justify="flex-start" margin="0 0 1em 0">
              <InlineText color="gray1" size="sm">
                RIN Price
              </InlineText>{' '}
            </Row>
            <InlineText color="gray0" size="xmd" weight={700}>
              <InlineText color="gray1" weight={700}>
                $
              </InlineText>
              {rinPrice ? rinPrice.toFixed(2) : ' ---'}
            </InlineText>
          </StatsBlock>
          <StatsBlock width="31%">
            <Row justify="flex-start" margin="0 0 1em 0">
              <InlineText color="gray1" size="sm">
                Circulating Supply
              </InlineText>{' '}
            </Row>
            <InlineText color="gray0" size="xmd" weight={700}>
              {poolInfo
                ? stripByAmountAndFormat(poolInfo.rinCirculationSupply, 2)
                : ' ---'}
            </InlineText>
          </StatsBlock>
          <MarketcapBlock width="31%">
            <Row justify="flex-start" margin="0 0 1em 0">
              <InlineText color="gray1" size="sm">
                Marketcap
              </InlineText>{' '}
            </Row>
            <InlineText color="gray0" size="xmd" weight={700}>
              <InlineText color="gray1" weight={700}>
                $
              </InlineText>
              {marketCap ? stripByAmountAndFormat(marketCap, 2) : ' ---'}
            </InlineText>
          </MarketcapBlock>
        </StretchedContent>
        <RowContainer>
          {' '}
          <GrayLink to="/staking/rin">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}

export const RinStakingBlock = queryRendererHoc({
  query: getDexTokensPricesQuery,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 10000,
})(Block)
