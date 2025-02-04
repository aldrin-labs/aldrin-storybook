import { BREAKPOINTS, COLORS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '@sb/components/Button'
import { Row } from '@sb/components/Layout'

export const RestakeButton = styled(Button)`
  color: ${(props) => props.theme.colors.green3};
  border: none;
  margin-right: 10px;

  &,
  &:disabled {
    color: ${(props) =>
      props.$loading ? 'transparent' : props.theme.colors.white1};
    background: none;
  }
`

export const ClaimButton = styled(Button)`
  color: ${(props) => props.theme.colors.white1};
  border: none;

  &,
  &:disabled {
    background: ${(props) => props.theme.colors.white6};
  }

  img {
    margin-right: 5px;
    padding-top: 5px;
  }
`

export const StakingFormButton = styled(Button)`
  min-width: 100%;
  padding: 1.75em;

  @media (min-width: ${BREAKPOINTS.sm}) {
    min-width: 14rem;
  }
`

export const UnStakingFormButton = styled(StakingFormButton)`
  background: ${COLORS.brown};
  border: 0.1rem solid ${COLORS.brown};
`

export const StretchedRow = styled(Row)`
  justify-content: space-between;
  margin: 8px;
  margin-top: 0;
`
