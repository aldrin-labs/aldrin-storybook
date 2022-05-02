import {
  COLORS,
  FONTS,
  BREAKPOINTS,
  BORDER_RADIUS,
  SIZE,
  FONT_SIZES,
} from '@variables/variables'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { MoreLinksPopupProps } from './types'

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

export const MoreLinksPopup = styled.div<MoreLinksPopupProps>`
  position: fixed;
  transition: opacity 0.1s ease-in;
  height: ${(props: MoreLinksPopupProps) =>
    props.opened ? 'calc(100vh - 60px)' : '0'};
  opacity: ${(props: MoreLinksPopupProps) => (props.opened ? '1' : '0')};
  overflow: hidden;
  width: 100%;
  bottom: 60px;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  font-family: ${FONTS.main};
  color: ${COLORS.main};
  font-size: ${SIZE.fontSize};
`

export const MoreLinksContent = styled.div`
  background: ${COLORS.blockBackground};
  padding: 1em 1.5em;
  border-radius: ${BORDER_RADIUS.md};
  position: absolute;
  width: calc(100% - 20px);
  left: 10px;
  bottom: 10px;
`

export const MoreLinkContainer = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  text-decoration: none;
  margin: 10px 0;

  span {
    color: ${COLORS.main};
    font-size: ${FONT_SIZES.sm};
    padding: 0 0 0 5px;
  }
`
