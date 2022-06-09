import React from 'react'

import { SvgIcon } from '@sb/components'
import { BlockTitle, BlockContent } from '@sb/components/Block'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useMarinadeStakingInfo } from '@sb/dexUtils/staking/hooks/useMarinadeStakingInfo'
import { toMap } from '@sb/utils/collection'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import InfoIcon from '@icons/info.svg'

import {
  ContentBlock,
  StakingBlock,
  StretchedContent,
  Line,
  GrayLink,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Marinade from './marinadeLogo.png'
import { AbsoluteImg, Filler, LogoWrap, RelativeContentBlock } from './styles'
import { MarinadeStakingProps } from './types'

const MrndStakingBlock: React.FC<MarinadeStakingProps> = (props) => {
  const { data: mSolInfo } = useMarinadeStakingInfo()

  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices },
  } = props

  const pricesMap = toMap(prices || [], (p) => p.symbol)

  const solPrice = pricesMap.get('SOL') || { price: 0 }

  const totalStakedSol = mSolInfo?.stats.tvl_sol || 0

  const totalStakedUsdValue = totalStakedSol * solPrice.price

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
          <RowContainer margin="0 0 1em 0" justify="space-between">
            <InlineText color="gray1" size="sm">
              Total Staked
            </InlineText>
            <InlineText color="gray0" size="xmd" weight={700}>
              {totalStakedSol
                ? stripByAmountAndFormat(totalStakedSol, 2)
                : ' ---'}
              <InlineText color="gray1" weight={600}>
                {' '}
                SOL{' '}
              </InlineText>
            </InlineText>
          </RowContainer>
          <RowContainer justify="space-between">
            <InlineText size="sm" color="gray1">
              to {mSolInfo?.stats.validators_count || '---'} Validators{' '}
            </InlineText>{' '}
            <InlineText size="sm" weight={700} color="gray0">
              <InlineText color="gray0">$</InlineText>
              {totalStakedUsdValue
                ? stripByAmountAndFormat(totalStakedUsdValue, 2)
                : ' ---'}
            </InlineText>
          </RowContainer>
        </ContentBlock>
        <Line />{' '}
        <StretchedContent>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 1em 0">
              <InlineText color="gray1" size="sm">
                mSOL Price
              </InlineText>{' '}
              <DarkTooltip title="mSOL/SOL price increases every epoch because staking rewards are accumulated into the SOL staked pool. Therefore, the ratio is not 1:1. This ratio only goes up with time.">
                <span>
                  <SvgIcon src={InfoIcon} width="0.75em" />
                </span>
              </DarkTooltip>
            </Row>
            <InlineText
              size="xmd"
              weight={700}
              style={{ whiteSpace: 'nowrap' }}
              color="gray0"
            >
              {mSolInfo?.stats.m_sol_price
                ? stripByAmountAndFormat(mSolInfo.stats.m_sol_price, 3)
                : ' ---'}{' '}
              <InlineText color="gray1" weight={600}>
                SOL
              </InlineText>
            </InlineText>
          </ContentBlock>
          <RelativeContentBlock width="48%">
            <RowContainer
              direction="column"
              align="flex-start"
              style={{ position: 'absolute', padding: '1em' }}
            >
              <RowContainer justify="space-between" margin="0 0 1em 0">
                <InlineText color="gray1" size="sm">
                  Epoch
                </InlineText>{' '}
                <DarkTooltip title="Epochs have variable length on the Solana blockchain. They are tied to the number of slots produced by the blockchain. Staking rewards are distributed at the end of each epoch.">
                  <span>
                    <SvgIcon src={InfoIcon} width="0.75em" />
                  </span>
                </DarkTooltip>
              </RowContainer>
              <InlineText color="gray0" size="xmd" weight={700}>
                {mSolInfo?.epochInfo.epochPct
                  ? stripByAmountAndFormat(mSolInfo.epochInfo.epochPct, 2)
                  : '---'}
                %
              </InlineText>{' '}
            </RowContainer>
            <Filler $width={mSolInfo?.epochInfo.epochPct || 0} />
          </RelativeContentBlock>
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
