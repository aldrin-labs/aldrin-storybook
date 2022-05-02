import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { FlexBlock, StretchedBlock } from '@sb/components/Layout'

import { BlockWithRadio } from '../MarinadeStaking/components/styles'
import { ContentBlock, StakingBlock } from '../Staking/styles'

export const Content = styled.div`
  margin: auto;
`

export const StakingContainer = styled(StretchedBlock)`
  width: 90vw;
  max-width: 750px;
  margin: 0 auto;
  padding: 0 1em;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
  }
`

export const ModeContainer = styled(BlockWithRadio)`
  margin: 0 0.5em;
  width: 100%;
  margin: 1em 0;
  overflow: hidden;
  height: 140px;
  padding: 12px;
  background-position: 12px 95%;
  background-repeat: no-repeat;
  background-size: 40%;

  ${(props: { $bg: string }) => `background-image: url(${props.$bg});`}

  @media (min-width: ${BREAKPOINTS.lg}) {
    height: 185px;
    margin: 0.5em;
    background-size: 80%;
    background-position: center 90%;
  }
`
export const AdaptiveStakingBlock = styled(StakingBlock)`
  margin: 1em 0;
  width: 100%;
`

export const AprWrap = styled.div`
  margin-top: 10px;
`

export const RewardContentBlock = styled(ContentBlock)`
  background: rgba(38, 159, 19, 10%);
  width: auto;
  @media (min-width: ${BREAKPOINTS.md}) {
    ${(props: { last?: boolean }) =>
      props.last ? `margin-left: 10px;` : 'margin-right: 10px;'}
  }
`

export const FormContainer = styled(FlexBlock)`
  padding: 0 1em 1em;
  min-height: 22em;
`
