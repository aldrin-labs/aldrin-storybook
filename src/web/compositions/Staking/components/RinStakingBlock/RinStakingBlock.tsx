import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useFarmInfo } from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useStakingPoolInfo } from '@sb/dexUtils/staking/hooks'
import { useRinStakingApr } from '@sb/dexUtils/staking/hooks/useRinStakingApr'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import { RIN_MINT } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import AldrinLogo from '@icons/Aldrin.svg'

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

const Block: React.FC<RinStakingBlockProps> = React.memo(
  (props) => {
    const {
      getDexTokensPricesQuery: { getDexTokensPrices },
    } = props

    const { data: farms } = useFarmInfo()
    const { data: poolInfo } = useStakingPoolInfo()

    const farm = farms?.get(RIN_MINT)

    const [totalStakedRIN] = useAccountBalance({
      publicKey: farm ? farm.stakeVault : undefined,
    })

    const rinHarvest = farm?.harvests.find(
      (harvest) => harvest.mint.toString() === RIN_MINT
    )

    const { data: apr } = useRinStakingApr({
      totalStaked: totalStakedRIN,
      harvest: rinHarvest,
    })

    const tokenName = getTokenNameByMintAddress(RIN_MINT)

    const rinPrice =
      getDexTokensPrices?.find((v) => v.symbol === tokenName)?.price || 0

    const marketCap = rinPrice * (poolInfo?.rinCirculationSupply || 0)

    const totalStakedUsdValue = rinPrice * totalStakedRIN

    const stakedPercentage =
      (totalStakedRIN / (poolInfo?.rinCirculationSupply || totalStakedRIN)) *
      100

    return (
      <StakingBlock>
        <LogoWrap>
          <img src={AldrinLogo} height="70" alt="Aldrin" />
          <AbsoluteImg src={Coins} height="auto" alt="Aldrin" />
        </LogoWrap>

        <BlockContent>
          <RowContainer justify="space-between">
            <BlockTitle>Stake RIN</BlockTitle>
            <NumberWithLabel value={apr || 0} label="APR" />
          </RowContainer>
          <ContentBlock>
            <RowContainer
              margin="0 0 1em 0"
              justify="space-between"
              align="flex-start"
            >
              <InlineText color="white1" size="sm">
                Total Staked
              </InlineText>
              <InlineText size="xmd" weight={700}>
                {totalStakedRIN
                  ? stripByAmountAndFormat(totalStakedRIN, 2)
                  : ' ---'}
                &nbsp;
                <InlineText color="white1" weight={600}>
                  RIN
                </InlineText>
              </InlineText>
            </RowContainer>
            <RowContainer justify="space-between">
              <InlineText size="sm">
                {stakedPercentage ? `${stakedPercentage.toFixed(2)}%` : '---'}{' '}
                of circulating supply
              </InlineText>{' '}
              <InlineText size="sm" weight={700}>
                <InlineText color="white1">$</InlineText>
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
                <InlineText color="white1" size="sm">
                  RIN Price
                </InlineText>{' '}
              </Row>
              <InlineText color="white1" size="xmd" weight={700}>
                <InlineText color="white1" weight={700}>
                  $
                </InlineText>
                {rinPrice ? rinPrice.toFixed(2) : ' ---'}
              </InlineText>
            </StatsBlock>
            <StatsBlock width="31%">
              <Row justify="flex-start" margin="0 0 1em 0">
                <InlineText color="white1" size="sm">
                  Circulating Supply
                </InlineText>{' '}
              </Row>
              <InlineText color="white1" size="xmd" weight={700}>
                {poolInfo
                  ? stripByAmountAndFormat(poolInfo.rinCirculationSupply, 2)
                  : ' ---'}
              </InlineText>
            </StatsBlock>
            <MarketcapBlock width="31%">
              <Row justify="flex-start" margin="0 0 1em 0">
                <InlineText color="white1" size="sm">
                  Marketcap
                </InlineText>{' '}
              </Row>
              <InlineText color="white1" size="xmd" weight={700}>
                <InlineText color="white2" weight={700}>
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
  },
  (prevProps, nextProps) =>
    prevProps.getDexTokensPricesQuery.getDexTokensPrices ===
    nextProps.getDexTokensPricesQuery.getDexTokensPrices
)

export const RinStakingBlock = queryRendererHoc({
  query: getDexTokensPricesQuery,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 10000,
})(Block)
