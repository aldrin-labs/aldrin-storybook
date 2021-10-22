import styled from 'styled-components'
import { Link } from 'react-router-dom'
// TODO: remove dat
import { maxMobileScreenResolution } from '@core/utils/config'

import { COLORS, SIZE, BORDER_RADIUS, BREAKPOINTS } from '../../../variables'


export const HeaderWrap = styled.header`
  display: none;
  flex-direction: row;
  height: 48px;
  background: ${COLORS.bodyBackground};
  border-bottom: 1px solid ${COLORS.border};
  padding: 0 ${SIZE.defaultPadding};

  @media(min-width: ${maxMobileScreenResolution}px) {
    display: flex;
  }
`

export const LogoBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-right: 1px solid ${COLORS.border};
  padding-right: ${SIZE.defaultPadding};
  margin: 5px 0;
`

export const LinksBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  border-right: 1px solid ${COLORS.border};
  margin: 5px 0;
`

export const MainLinksBlock = styled(LinksBlock)`
  margin: 5px auto;
  border-right: 0;
`

export const WalletBlock = styled.div`
  margin-left: auto;
`

export const LogoLink = styled(Link)`
  display: block;
  height: 100%;
  margin-right: ${SIZE.defaultPadding};
`

export const Logo = styled.img`
  height: 100%;
`

export const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 0.8em;
  padding: 4px;
  margin: 0 2px;
  border-radius: ${BORDER_RADIUS.md};
  color: ${COLORS.hint};
  background: ${COLORS.bodyBackground};
  transition: all ease-in 0.2s;
  border: 0;
  cursor: pointer;

  &:hover {
    font-size: 0.9em;
    color: ${COLORS.navLinkActive};
    background: ${COLORS.navLinkActiveBg};
  }

  @media(min-width: ${BREAKPOINTS.xl}) {
    & {
      padding: 8px;
      margin: 0 5px;
    }
  }
`