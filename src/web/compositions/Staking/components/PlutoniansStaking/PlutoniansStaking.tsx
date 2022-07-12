import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { FlexBlock } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

import { StakingBlock } from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import PldIcon from './assets/stake-pld.png'
import PuIcon from './assets/stake-pu238.png'
import RpcIcon from './assets/stake-rpc.png'
import {
  ContentBlock,
  LogoWrap,
  StakePoolButtonContainer,
  StakePoolLink,
  StakePoolText,
  StakePoolWrap,
  RootFlexBlock,
} from './styles'

export const PlutoniasStakingBlock: React.FC = () => {
  return (
    <StakingBlock>
      <LogoWrap />
      <BlockContent>
        <RootFlexBlock justifyContent="space-between">
          <BlockTitle>Plutonians</BlockTitle>
          <NumberWithLabel padding="0" value={null} label="Exclusive" />
        </RootFlexBlock>

        <FlexBlock flex="1" direction="column" justifyContent="space-between">
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
        </FlexBlock>
      </BlockContent>
    </StakingBlock>
  )
}
