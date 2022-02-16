import { COLORS, FONT_SIZES, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { Button } from '../Button'
import { Row } from '../Layout'

export const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  padding: 1em 0;

  @media (max-width: 1000px) {
    display: none;
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
  background: ${COLORS.cardsBack};
  border: none;
  color: ${COLORS.gray3};
  border-radius: ${BORDER_RADIUS.lg};
  padding: 0.5em;
  font-size: ${FONT_SIZES.lg};
  margin: 0 1rem;
`
