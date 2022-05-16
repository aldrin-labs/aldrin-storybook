import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { InlineText } from '@sb/components/Typography'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { FlexBlock } from '../../../../components/Layout'
import { StakingBlock, PLDContentBlock } from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import PldIcon from './assets/stake-pld.png'
import PuIcon from './assets/stake-pu238.png'
import RpcIcon from './assets/stake-rpc.png'
import {
  LogoWrap,
  StakePoolWrap,
  StakePoolText,
  StakePoolButtonContainer,
  StakePoolLink,
} from './styles'

export const PlutoniasStakingBlock: React.FC = () => {
  // const { data: stakingPool } = usePlutoniansStaking()
  // const tiers = stakingPool?.tiers.slice(0, 4).reverse() || []
  // const tiersGroup1 = tiers.slice(0, 2)
  // const tiersGroup2 = tiers.slice(2)

  return (
    <StakingBlock>
      <LogoWrap />
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake PLD</BlockTitle>
          <NumberWithLabel padding="0" value={null} label="Exclusive" />
        </RowContainer>
        <FlexBlock flex="1" direction="column" justifyContent="space-between">
          <StakePoolWrap>
            <PLDContentBlock>
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
            </PLDContentBlock>
          </StakePoolWrap>
          <StakePoolWrap>
            <PLDContentBlock>
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
            </PLDContentBlock>
          </StakePoolWrap>
          <StakePoolWrap>
            <PLDContentBlock>
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
            </PLDContentBlock>
          </StakePoolWrap>
        </FlexBlock>
        {/* <StretchedContent>
          {tiersGroup1.map((tier) => (
            <ContentBlock width="48%" key={`tier_${tier.publicKey.toString()}`}>
              <Row justify="space-between" margin="0 0 0.7em 0">
                <InlineText size="md" weight={700}>
                  {tier?.account.lockDuration.divn(DAY).toString()} Days
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
                <InlineText size="md" weight={700}>
                  {tier?.account.lockDuration.divn(DAY).toString()} Days
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
        </RowContainer> */}
      </BlockContent>
    </StakingBlock>
  )
}
