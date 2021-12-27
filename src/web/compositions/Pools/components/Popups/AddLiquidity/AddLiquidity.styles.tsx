import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import styled from 'styled-components'

export const WarningLabel = styled(WhiteText)`
  cursor: pointer;
  color: ${props => props.$color || '#f2abb1'};
  font-size: 1.12rem;
  font-family: Avenir Next Medium;
  letter-spacing: 0.01rem;
`
