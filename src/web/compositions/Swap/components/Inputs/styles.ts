import { COLORS, BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const InputContainer = styled(RowContainer)`
  position: relative;
  justify-content: space-between;
  height: 4em;
  background: ${(props) =>
    props.disabled ? COLORS.disabledInput : COLORS.blockBackground};
  border: 0.1rem solid #383b45;
  border-radius: 0;
  ${(props) =>
    props.roundSides.map(
      (roundSide: string) => `border-${roundSide}-radius: ${BORDER_RADIUS.md};`
    )}
`

export const DropdownIconContainer = styled(Row)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
`

export const AmountInputContainer = styled(Row)`
  width: 40%;

  @media (min-width: ${BREAKPOINTS.xs}) {
    width: 50%;
  }
`
