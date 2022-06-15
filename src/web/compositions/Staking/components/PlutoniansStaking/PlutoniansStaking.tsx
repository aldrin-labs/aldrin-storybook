import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { FlexBlock } from '@sb/components/Layout'
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
        <FlexBlock justifyContent="space-between">
          <BlockTitle>Plutonians</BlockTitle>
          <NumberWithLabel padding="0" value={null} label="Exclusive" />
        </FlexBlock>

        {/* <FlexBlock flex="1" direction="column" justifyContent="space-between">
          <StakePoolWrap>
            <ContentBlock>
              <FlexBlock alignItems="center">
                <img src={PldIcon} alt="Stake PLD" />
                <StakePoolText>
                  <div>
                    <InlineText weight={700}>Stake PLD</InlineText>
                  </div>
                  <InlineText>NFT &amp; up to 20% APR</InlineText>
                </StakePoolText>
                <StakePoolButtonContainer>
                  <StakePoolLink to="/staking/plutonians/pld">
                    View
                  </StakePoolLink>
                </StakePoolButtonContainer>
              </FlexBlock>
            </ContentBlock>
          </StakePoolWrap>
          <StakePoolWrap>
            <ContentBlock>
              <FlexBlock alignItems="center">
                <img src={RpcIcon} alt="Stake RPC" />
                <StakePoolText>
                  <div>
                    <InlineText weight={700}>Stake RPC</InlineText>
                  </div>
                  <InlineText>NFT &amp; up to 20% APR</InlineText>
                </StakePoolText>
                <StakePoolButtonContainer>
                  <StakePoolLink to="/staking/plutonians/rpc">
                    View
                  </StakePoolLink>
                </StakePoolButtonContainer>
              </FlexBlock>
            </ContentBlock>
          </StakePoolWrap>
          <StakePoolWrap>
            <ContentBlock>
              <FlexBlock alignItems="center">
                <img src={PuIcon} alt="Stake PU238" />
                <StakePoolText>
                  <div>
                    <InlineText weight={700}>Stake PU238</InlineText>
                  </div>
                  <InlineText>NFT &amp; up to 20% APR</InlineText>
                </StakePoolText>
                <StakePoolButtonContainer>
                  <StakePoolLink to="/staking/plutonians/pu238">
                    View
                  </StakePoolLink>
                </StakePoolButtonContainer>
              </FlexBlock>
            </ContentBlock>
          </StakePoolWrap>
        </FlexBlock> */}
        <StretchedContent>
          {tiersGroup1.map((tier) => (
            <ContentBlock width="48%" key={`tier_${tier.publicKey.toString()}`}>
              <Row justify="space-between" margin="0 0 0.7em 0">
                <InlineText color="gray0" size="md" weight={700}>
                  {tier?.account.lockDuration.seconds.divn(DAY).toString()} Days
                </InlineText>{' '}
                <SvgIcon src={Lock} alt="locked" />
              </Row>
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
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
                <InlineText size="md" weight={700} color="gray0">
                  {tier?.account.lockDuration.seconds.divn(DAY).toString()} Days
                </InlineText>{' '}
                <SvgIcon src={Lock} alt="locked" />
              </Row>
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
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
