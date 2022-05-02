import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { DAY } from '@core/utils/dateUtils'

import { usePlutoniansStaking } from '../../../../dexUtils/staking/hooks'
import {
  ContentBlock,
  StakingBlock,
  StretchedContent,
  GrayLink,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Lock from './lock.svg'
import { LogoWrap } from './styles'

export const PlutoniasStakingBlock: React.FC = () => {
  const { data: stakingPool } = usePlutoniansStaking()
  const tiers = stakingPool?.tiers.slice(0, 4).reverse() || []
  const tiersGroup1 = tiers.slice(0, 2)
  const tiersGroup2 = tiers.slice(2)

  return (
    <StakingBlock>
      <LogoWrap />
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake PLD</BlockTitle>
          <NumberWithLabel padding="0" value={null} label="Exclusive" />
        </RowContainer>
        <StretchedContent>
          {tiersGroup1.map((tier) => (
            <ContentBlock width="48%" key={`tier_${tier.publicKey.toString()}`}>
              <Row justify="space-between" margin="0 0 0.7em 0">
                <InlineText size="md" weight={700}>
                  {tier?.account.lockDuration.seconds.divn(DAY).toString()} Days
                </InlineText>{' '}
                <SvgIcon src={Lock} alt="locked" />
              </Row>
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                // label={`${
                //   (parseInt(tier?.account.apr.toString() || '0', 10) /
                //     REWARD_APR_DENOMINATOR) *
                //   100
                // }% APR  `}
                label="APR + NFT"
                center
              />
            </ContentBlock>
          ))}
        </StretchedContent>
        <StretchedContent style={{ margin: '1.6em 0 0 0' }}>
          {tiersGroup2.map((tier) => (
            <ContentBlock width="48%" key={`tier_${tier.publicKey.toString()}`}>
              <Row justify="space-between" margin="0 0 0.7em 0">
                <InlineText size="md" weight={700}>
                  {tier?.account.lockDuration.seconds.divn(DAY).toString()} Days
                </InlineText>{' '}
                <SvgIcon src={Lock} alt="locked" />
              </Row>
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                // label={`${
                //   (parseInt(tier?.account.apr.toString() || '0', 10) /
                //     REWARD_APR_DENOMINATOR) *
                //   100
                // }% APR  `}
                label="APR + NFT"
                center
              />
            </ContentBlock>
          ))}
        </StretchedContent>
        <RowContainer>
          <GrayLink to="/staking/plutonians">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}
