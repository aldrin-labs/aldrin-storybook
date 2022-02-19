import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { StretchedBlock } from '@sb/components/Layout'

import { BlockWithRadio } from '../MarinadeStaking/components/styles'
import { StakingBlock } from '../Staking/styles'

export const StakingContainer = styled(StretchedBlock)`
  width: 100%;
  padding: 0 1em;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: row;
    width: 50%;
  }
`

export const ModeContainer = styled(BlockWithRadio)`
  margin: 0 1rem;
  @media (max-width: ${BREAKPOINTS.md}) {
    margin: 2rem 0;
    width: 100%;

    .aldrinSkin {
      width: 40%;
    }
  }
`
export const AdaptiveStakingBlock = styled(StakingBlock)`
  margin: 2rem 0;
  @media (min-width: ${BREAKPOINTS.md}) {
    margin: 0 8px;
  }
`
