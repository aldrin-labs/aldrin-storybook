import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useFarmsInfo } from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { DAYS_TO_CHECK_BUY_BACK } from '@sb/dexUtils/staking/config'
import { useStakingPoolInfo } from '@sb/dexUtils/staking/hooks'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'

import { getDexTokensPrices as getDexTokensPricesQuery } from '@core/graphql/queries/pools/getDexTokensPrices'
import { FARMING_V2_TEST_TOKEN } from '@core/solana'
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

    const { data: farms } = useFarmsInfo()
    const { data: poolInfo } = useStakingPoolInfo()

    const farm = farms?.get(FARMING_V2_TEST_TOKEN)

    const [totalStakedRIN] = useAccountBalance({
      publicKey: farm ? farm.stakeVault : undefined,
    })

    const tokenName = getTokenNameByMintAddress(
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'
    ) // getTokenNameByMintAddress(farm?.stakeMint.toString())

    const rinPrice =
      getDexTokensPrices?.find((v) => v.symbol === tokenName)?.price || 0

    const marketCap = rinPrice * (poolInfo?.rinCirculationSupply || 0)

    const totalStakedUsdValue = rinPrice * totalStakedRIN

    const stakedPercentage =
      (totalStakedRIN / (poolInfo?.rinCirculationSupply || totalStakedRIN)) *
      100

    const buyBackAPR =
      ((poolInfo?.poolInfo.apr.buyBackAmountWithoutDecimals || 0) /
        DAYS_TO_CHECK_BUY_BACK /
        totalStakedRIN) *
      365 *
      100

    console.log('buyBackAPR:', buyBackAPR, totalStakedRIN)

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
              <InlineText size="xmd" weight={700}>
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
                {stakedPercentage ? `${stakedPercentage.toFixed(2)}%` : '---'}{' '}
                of circulating supply
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
