import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

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
import { LogoWrap, AbsoluteImg } from './styles'

export const RinStakingBlock: React.FC = (props) => {
  return (
    <StakingBlock>
      <LogoWrap>
        <img src={AldrinLogo} height="70" alt="Aldrin" />
        <AbsoluteImg src={Coins} height="auto" width="25%" alt="Aldrin" />
      </LogoWrap>
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake RIN</BlockTitle>
          <NumberWithLabel value={45} label="APR" />
        </RowContainer>
        <ContentBlock>
          <RowContainer
            margin="0 0 2rem 0"
            justify="space-between"
            align="flex-start"
          >
            <InlineText color="primaryGray" size="sm">
              Total Staked
            </InlineText>
            <InlineText size="rg" weight={700}>
              10.25m{' '}
              <InlineText color="primaryGray" weight={600}>
                RIN
              </InlineText>
            </InlineText>
          </RowContainer>
          <RowContainer justify="space-between">
            <InlineText size="sm">25.24% of circulating supply</InlineText>{' '}
            <InlineText size="sm" weight={700}>
              <InlineText color="primaryGray">$</InlineText> 10.25m
            </InlineText>
          </RowContainer>
        </ContentBlock>
        <Line />{' '}
        <StretchedContent>
          <ContentBlock width="31%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                RIN Price
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              <InlineText color="primaryGray" weight={700}>
                $
              </InlineText>{' '}
              10.25m
            </InlineText>
          </ContentBlock>
          <ContentBlock width="31%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                Circulating Supply
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              11.42m
            </InlineText>
          </ContentBlock>
          <ContentBlock width="31%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                Marketcap
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              <InlineText color="primaryGray" weight={700}>
                $
              </InlineText>{' '}
              10.25m
            </InlineText>
          </ContentBlock>
        </StretchedContent>
        <RowContainer>
          {' '}
          <GrayLink to="/staking/rin">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}
