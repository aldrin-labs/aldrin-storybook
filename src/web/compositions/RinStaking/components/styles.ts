import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '@sb/components/Button'

export const RestakeButton = styled(Button)`
  color: ${COLORS.primaryGray};
  border: none;
  margin-right: 10px;

  &,
  &:disabled {
    background: none;
  }
`

export const ClaimButton = styled(Button)`
  color: ${COLORS.primaryGray};
  border: none;

  &,
  &:disabled {
    background: ${COLORS.defaultGray};
  }
`

export const StakingFormButton = styled(Button)`
  padding: 2rem;
`

export const UnStakingFormButton = styled(StakingFormButton)`
  padding: 2.1rem 2rem;
  background: ${COLORS.brown};
  border: 0.1rem solid ${COLORS.brown};
`
