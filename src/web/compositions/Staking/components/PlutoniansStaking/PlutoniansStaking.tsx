import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  ContentBlock,
  StakingBlock,
  StretchedContent,
  GrayLink,
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
          <NumberWithLabel padding="0" value={null} label="Exclusive" />
        </RowContainer>
        <StretchedContent>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 0.7em 0">
              <InlineText size="md" weight={700}>
                60 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="Coming"
              center
            />
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 0.7em 0">
              <InlineText size="md" weight={700}>
                90 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="Coming"
              center
            />
          </ContentBlock>
        </StretchedContent>
        <StretchedContent style={{ margin: '1.6em 0 0 0' }}>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 0.7em 0">
              <InlineText size="md" weight={700}>
                120 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="Coming"
              center
            />
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="space-between" margin="0 0 0.7em 0">
              <InlineText size="md" weight={700}>
                150 Days
              </InlineText>{' '}
              <SvgIcon src={Lock} alt="locked" />
            </Row>
            <NumberWithLabel
              size={FONT_SIZES.es}
              value={null}
              label="Coming "
              center
            />
          </ContentBlock>
        </StretchedContent>
        <RowContainer>
          <GrayLink to="/staking/plutonians">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}
