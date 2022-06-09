import { COLORS, MAIN_FONT } from '@variables/variables'
import styled from 'styled-components'

import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const WarningLabel = styled(WhiteText)`
  cursor: pointer;
  color: ${(props) => props.$color || COLORS.lightRed};
  font-size: 1.12rem;
  font-family: ${MAIN_FONT} Medium;
  letter-spacing: 0.01rem;
`

export const PriceImpactWarningBlock = styled(RowContainer)`
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 1.2rem;
`
