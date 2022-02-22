import { COLORS, BREAKPOINTS } from '@variables/variables'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const StyledLink = styled(NavLink)`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: ${COLORS.primaryWhite};
  font-family: Avenir Next Medium;
  font-size: 1.9rem;
  margin: -1px 20px 0;
  border-top: 1px solid transparent;
  span {
    margin-top: 1rem;
  }

  &.active {
    border-top: 1px solid ${COLORS.primaryWhite};
  }
`
export const StyledA = styled.a`
  width: 7rem;
  height: 6rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.9rem;
  span {
    margin-top: 1rem;
  }
`

export const FooterComponent = styled(RowContainer)`
  position: fixed;
  bottom: 0;
  z-index: 999;
  display: flex;
  background-color: ${COLORS.mainBlack};
  height: 65px;
  border-top: 1px solid ${COLORS.cardsBack};

  @media (min-width: ${BREAKPOINTS.md}) {
    display: none;
  }
`

export const StyledButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 7rem;
  height: 6rem;
  text-align: center;
  text-decoration: none;
  color: #fbf2f2;
  font-family: Avenir Next Medium;
  font-size: 1.9rem;
`
