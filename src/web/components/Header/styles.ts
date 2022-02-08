import { COLORS, SIZE, BREAKPOINTS, BORDER_RADIUS } from '@variables/variables'
import { Link, NavLink as RouterNavLink } from 'react-router-dom'
import styled from 'styled-components'
// TODO: remove dat

import { Button } from '../Button'
import { Text } from '../Typography'

export const HeaderWrap = styled.header`
  display: flex;
  flex-direction: row;
  height: 60px;
  background: ${COLORS.mainBlack};
  padding: 0 ${SIZE.defaultPadding};
`

export const LogoBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: ${SIZE.defaultPadding};
  margin: 8px 0;
  flex: 0 1 auto;
`

export const StakeButton = styled(Button)`
  display: none;

  @media (min-width: ${BREAKPOINTS.md}) {
    display: block;
  }
`

interface ShowHideProps {
  show?: keyof typeof BREAKPOINTS
  hide?: keyof typeof BREAKPOINTS
}

interface LinkProps extends ShowHideProps {
  new?: boolean
}

export const NavLink = styled(RouterNavLink)<LinkProps>`
  text-decoration: none;
  font-size: 0.8em;
  padding: 8px 12px;
  margin: 0px 4px;
  text-align: center;
  color: ${COLORS.primaryGray};
  background: transparent;
  transition: all ease-in 0.2s;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;

  &:hover,
  &.selected {
    color: ${COLORS.activeWhite};
    border-bottom: 1px solid ${COLORS.activeWhite};
    transition: all ease-in 0.2s;
  }

  ${(props: LinkProps) =>
    props.show
      ? `
    display: none;

    @media(min-width: ${BREAKPOINTS[props.show]}) {
      display: inline;
    }
  `
      : ''}

  ${(props: LinkProps) =>
    props.hide
      ? `
    @media(min-width: ${BREAKPOINTS[props.hide]}) {
      display: none;
    }
  `
      : ''}

  ${(props: LinkProps) =>
    props.new
      ? `
    &:after {
      content: "NEW";
      color: ${COLORS.success};
      position: relative;
      top: -5px;
      font-weight: 600;
      font-size: 0.7em;
      padding-left: 5px;
    }
  `
      : ''}
`

export const LinksBlock = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  margin: 5px 0;

  @media (min-width: ${BREAKPOINTS.lg}) {
    display: flex;
  }
`

export const MainLinksWrap = styled(LinksBlock)`
  margin: 5px auto;
  border-right: 0;
  display: none;
  flex: 1;
  flex-direction: row;

  @media (min-width: ${BREAKPOINTS.md}) {
    display: flex;
  }
`

export const MainLinksBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin: 0 auto;
  justify-content: space-between;
  max-width: 600px;
`

export const WalletContainer = styled.div`
  margin: 5px 0 5px auto;
  padding: 0 0 0 ${SIZE.defaultPadding};
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`

export const LogoLink = styled(Link)`
  // height: 100%;
  margin-right: ${SIZE.defaultPadding};
  display: block;
`

export const Logo = styled.img`
  height: 31px;
  display: block;
  margin: 0;
`

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  flex-direction: column;
  display: none;
  z-index: 1;
  background: rgba(0, 0, 0, 0.001);
`

export const DropdownWrap = styled.div<ShowHideProps>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover ${DropdownContent} {
    display: flex;
  }

  /*${(props: ShowHideProps) =>
    props.show
      ? `
    display: none;

    @media(min-width: ${BREAKPOINTS[props.show]}) {
      display: flex;
    }
  `
      : ''}

  ${(props: ShowHideProps) =>
    props.hide
      ? `
    @media(min-width: ${BREAKPOINTS[props.hide]}) {
      display: none;
    }
  `
      : ''}*/
`

export const DropdownInner = styled.div`
  min-width: 6em;
  background: ${COLORS.bodyBackground};
  border: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 0;

  & ${NavLink} {
    margin: 4px;
  }
`

export const WalletButton = styled(Button)`
  width: 100%;
  padding: 10px 20px;
  font-size: 0.75em;
  background-color: ${COLORS.bluePrimary};
  border: none;
  font-weight: 600;
`

export const WalletDataContainer = styled.div`
  width: 100%;
  height: 
  border-radius: ${BORDER_RADIUS.md};
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
    align-items: flex-start;
  }

    button {
      display: none;
    }

  &:hover {
    button {
        display: block;
      }
  }
`

export const WalletData = styled.div``

export const WalletName = styled(Text)`
  font-size: 0.6em;
  line-height: 1.3;
  margin: 0;
  color: ${COLORS.primaryWhite};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`

export const WalletAddress = styled(WalletName)`
  opacity: 0.5;
  font-weight: normal;
  display: none;

  @media (min-width: ${BREAKPOINTS.md}) {
    display: block;
  }
`

export const WalletDisconnectButton = styled(Button)`
  width: 100%;
  padding: 10px 20px;
  font-size: 0.75em;
  background-color: ${COLORS.newOrange};
  border: none;
  font-weight: 600;
`
