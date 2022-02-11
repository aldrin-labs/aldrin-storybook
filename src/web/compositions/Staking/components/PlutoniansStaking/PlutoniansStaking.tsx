import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  ContentBlock,
  GrayButton,
  StakingBlock,
  StretchedContent,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Lock from './lock.svg'
import { LogoWrap } from './styles'

export const PlutoniasStakingBlock: React.FC = (props) => {
  return (
    <StakingBlock>
      <LogoWrap />
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake PLD</BlockTitle>
          <NumberWithLabel value={null} label="Exclusive" />
        </RowContainer>
        <StretchedContent>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 2rem 0">
              <InlineText size="md" weight={700}>
                14 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="12% APR + NFT"
            />
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 2rem 0">
              <InlineText size="md" weight={700}>
                30 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="17% APR + NFT"
            />
          </ContentBlock>
        </StretchedContent>
        <StretchedContent style={{ margin: '0.5rem 0 0 0' }}>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 2rem 0">
              <InlineText size="md" weight={700}>
                90 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="22% APR + NFT"
            />
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 2rem 0">
              <InlineText size="md" weight={700}>
                180 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="63% APR + NFT"
            />
          </ContentBlock>
        </StretchedContent>
        <GrayButton>Soon Exclusively on Aldrin</GrayButton>
      </BlockContent>
    </StakingBlock>
  )
}
