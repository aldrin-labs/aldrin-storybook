import {
  UCOLORS,
  COLORS,
  FONT_SIZES,
  BORDER_RADIUS,
  BREAKPOINTS,
} from '@variables/variables'
import styled from 'styled-components'

import { Button } from '../Button'
import { Row } from '../Layout'

export const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  padding: 3.5em;
  flex-wrap: nowrap;

  @media (max-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
  }
`
export const MediaContainer = styled(Row)`
  width: 25%;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  @media (max-width: 1000px) {
    width: 100%;
  }
`

export const FooterButton = styled(Button)`
  background: ${UCOLORS.gray6};
  border: none;
  color: ${UCOLORS.gray1};
  border-radius: ${BORDER_RADIUS.md};
  padding: 0.5em;
  font-size: ${FONT_SIZES.lg};
  margin: 0 0.5em;

  &:hover {
    background: ${COLORS.primaryBlue};
    color: ${COLORS.primaryWhite};
  }

  &:last-child {
    margin: 0 0 0 1rem;
  }

  @media (max-width: ${BREAKPOINTS.md}) {
    display: none;
  }
`
