import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const InputContainer = styled(RowContainer)`
  position: relative;
  justify-content: space-between;
  height: 4em;
  background: ${(props) =>
    props.disabled ? props.theme.colors.white4 : props.theme.colors.white4};
  border: none;
  border-radius: 0;
`

export const DropdownIconContainer = styled(Row)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.white6};

  svg {
    width: 0.5875em;
    height: 0.5875em;
    path {
      stroke: ${(props) => props.theme.colors.white1};
    }
  }
`

export const AmountInputContainer = styled(Row)`
  width: 40%;

  @media (min-width: ${BREAKPOINTS.xs}) {
    width: 50%;
  }
`

export const MaxAmountRow = styled(Row)`
  &:hover {
    cursor: pointer;
  }
`
