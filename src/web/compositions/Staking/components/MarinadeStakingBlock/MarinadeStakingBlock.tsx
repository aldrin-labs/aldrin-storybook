import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { toMap } from '@sb/utils/collection'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { useMarinadeStakingInfo } from '../../../../dexUtils/staking/hooks/useMarinadeStakingInfo'
import {
  ContentBlock,
  StakingBlock,
  StretchedContent,
  Line,
  GrayLink,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Marinade from './marinadeLogo.svg'
import { AbsoluteImg, LogoWrap } from './styles'
import { MarinadeStakingProps } from './types'

const MrndStakingBlock: React.FC<MarinadeStakingProps> = (props) => {
  const { data: mSolInfo } = useMarinadeStakingInfo()

  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices },
  } = props

  const pricesMap = toMap(prices, (p) => p.symbol)

  const solPrice = pricesMap.get('SOL') || { price: 0 }

  const totalStakedSol = mSolInfo?.stats.tvl_sol || 0

  const totalStakedUsdValue = totalStakedSol * solPrice.price

  const epochPct = mSolInfo
    ? (mSolInfo.epochInfo.slotIndex / mSolInfo.epochInfo.slotsInEpoch) * 100
    : 0

  return (
    <StakingBlock>
      <LogoWrap>
        <AbsoluteImg src={Marinade} alt="Marinade" />
      </LogoWrap>
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake mSOL</BlockTitle>
          <NumberWithLabel
            value={mSolInfo?.stats.avg_staking_apy || 0}
            label="APY"
          />
        </RowContainer>
        <ContentBlock>
          <RowContainer margin="0 0 2rem 0" justify="space-between">
            <InlineText color="primaryGray" size="sm">
              Total Staked
            </InlineText>
            <InlineText size="rg" weight={700}>
              {totalStakedSol
                ? stripByAmountAndFormat(totalStakedSol, 2)
                : '---'}
              <InlineText color="primaryGray" weight={600}>
                {' '}
                SOL{' '}
              </InlineText>
            </InlineText>
          </RowContainer>
          <RowContainer justify="space-between">
            <InlineText size="sm" color="primaryGray">
              to {mSolInfo?.stats.validators_count || 0} Validators{' '}
            </InlineText>{' '}
            <InlineText size="sm" weight={700}>
              <InlineText color="primaryGray">$</InlineText>
              {totalStakedUsdValue
                ? stripByAmountAndFormat(totalStakedUsdValue, 2)
                : '---'}
            </InlineText>
          </RowContainer>
        </ContentBlock>
        <Line />{' '}
        <StretchedContent>
          <ContentBlock width="48%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                mSOL Price
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700} style={{ whiteSpace: 'nowrap' }}>
              {mSolInfo?.stats.m_sol_price
                ? stripByAmountAndFormat(mSolInfo.stats.m_sol_price, 3)
                : '---'}{' '}
              <InlineText color="primaryGray" weight={600}>
                SOL
              </InlineText>
            </InlineText>
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                Epoch
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              {stripByAmountAndFormat(epochPct, 2)}%
            </InlineText>
          </ContentBlock>
        </StretchedContent>
        <RowContainer>
          <GrayLink to="/staking/marinade">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}

export const MarinadeStakingBlock = queryRendererHoc({
  query: getDexTokensPrices,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 60000,
})(MrndStakingBlock)
