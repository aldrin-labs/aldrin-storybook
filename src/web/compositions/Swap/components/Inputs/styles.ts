import { BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const InputContainer = styled(RowContainer)`
  position: relative;
  justify-content: space-between;
  background: ${(props) => props.theme.colors.white6};
  border: none;
  border-radius: 0;
`

export const DropdownIconContainer = styled(Row)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;

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

export const MaxAmountText = styled(Text)`
  color: ${(props) => props.theme.colors.white2};
  letter-spacing: -0.005em;
  font-size: 0.6em;
`

export const MaxAmountRow = styled(Row)`
  &:hover {
    cursor: pointer;

    ${MaxAmountText} {
      color: ${(props) => props.theme.colors.white1};
    }
  }
`
