import {
  UCOLORS,
  COLORS,
  SIZE,
  BREAKPOINTS,
  BORDER_RADIUS,
  FONT_SIZES,
  TRANSITION,
} from '@variables/variables'
import { Link, NavLink as RouterNavLink } from 'react-router-dom'
import styled from 'styled-components'

// TODO: remove dat

import { Button } from '../Button'
import { Text } from '../Typography'

export const HeaderWrap = styled.header`
  display: flex;
  flex-direction: row;
  height: 60px;
  background: ${(props) => props.theme.colors.gray9};
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
  left?: boolean
}

type CopyButton = {
  isCopied: boolean
}

export const NavLink = styled(RouterNavLink)<LinkProps>`
  text-decoration: none;
  font-size: 0.8em;
  padding: 4px 0;
  margin: 0;
  text-align: ${(props: LinkProps) => (props.left ? 'left' : 'center')};
  color: ${(props) => props.theme.colors.gray1};
  background: transparent;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  transition: 0.3s;

  &.dropdown {
    &:hover {
      border-bottom: none;
    }
  }

  &.selected-from-dropdown {
    color: ${(props) => props.theme.colors.gray0};
    svg {
      path {
        fill: ${(props) => props.theme.colors.gray0};
      }
    }
  }

  svg,
  img {
    margin: 0 0.5rem;
  }

  &:hover {
    color: ${(props) => props.theme.colors.gray0};
    transition: 0.3s;
    svg {
      path {
        fill: ${(props) => props.theme.colors.gray0};
      }
    }
  }

  &.selected {
    color: ${(props) => props.theme.colors.gray0};
    border-bottom: 1px solid ${(props) => props.theme.colors.gray0};
    transition: all ease-in 0.2s;
    svg {
      path {
        fill: ${(props) => props.theme.colors.gray0};
      }
    }
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

  ${(props: LinkProps) =>
    props.beta
      ? `
      &:after {
        content: "BETA";
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
  margin-right: 15px;
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
  z-index: 99;
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
  background: ${(props) => props.theme.colors.gray5};
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 0.5em;
  border-radius: ${BORDER_RADIUS.md};
  & ${NavLink} {
    margin: 4px;

    &:hover {
      border: none;
    }
  }
`

export const WalletButton = styled(Button)`
  width: 17rem;
  white-space: nowrap;
  padding: 10px 20px;
  font-size: 0.75em;
  background-color: ${(props) => props.theme.colors.blue3};
  border: none;
  font-weight: 600;
  height: 3.5em;
  transition: ${TRANSITION};
  color: white;

  &:hover {
    background: ${UCOLORS.blue4};
  }

  &:active,
  &:focus {
    background: ${COLORS.darkBlue};
  }

  @media (max-width: 1100px) {
    padding: 7px 10px;
  }
`

export const WalletDataContainer = styled.div`
  width: 8.5em;
  border-radius: ${BORDER_RADIUS.md};
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 120px;

  @media (min-width: ${BREAKPOINTS.md}) {
    flex-direction: column;
    align-items: flex-start;
  }

  .disconnect-wallet {
    display: none;
  }

  &:hover {
    .disconnect-wallet {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }
  }

  .wallet-data {
    display: flex;
  }

  &:hover {
    .wallet-data {
      display: none;
    }
  }
`

export const WalletData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: ${BORDER_RADIUS.md};
  background: ${(props) => props.theme.colors.gray6};
  align-items: center;
  img {
    border-radius: 50%;
  }

  @media (max-width: 1200px) {
    padding: 1rem 1.5rem;
    height: 7rem;
    img {
      width: 25px;
      height: 25px;
    }
  }
`
export const Column = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 0.4em;
`

export const WalletName = styled(Text)`
  font-size: 0.6em;
  line-height: 1.3;
  margin: 0;
  color: ${(props) => props.theme.colors.gray1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`

export const WalletAddress = styled(WalletName)`
  opacity: 0.5;
  font-weight: 400;
  display: block;
  font-size: ${FONT_SIZES.sm};

  @media (max-width: 1200px) {
    font-size: ${FONT_SIZES.sm};
  }
`

export const WalletDisconnectButton = styled(Button)`
  width: calc(100% - 5rem);
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75em;
  background-color: ${COLORS.newOrange};
  border: none;
  font-weight: 600;
  height: 100%;
  transition: ${TRANSITION};
  border-radius: 8px 0 0 8px;
  min-width: 2rem;

  &:hover {
    background-color: ${COLORS.primaryRed};
  }

  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      ${COLORS.primaryRed};
  }
`
export const BalanceTitle = styled.span`
  font-size: ${FONT_SIZES.sm};
  color: ${(props) => props.theme.colors.green7};
  font-weight: 600;
  white-space: nowrap;
  @media (max-width: 1200px) {
    font-size: 0.7125em;
  }
`

export const Wrap = styled.div`
  padding: 0 15px;
  background: ${(props) => props.theme.colors.gray9};

  @media (min-width: ${BREAKPOINTS.lg}) {
    padding: 0 1.5em;
  }
`
export const WalletDisconnectBlock = styled.div`
  width: 100%;
  height: 5rem;
`

export const CopyAddressButton = styled(Button)<CopyButton>`
  width: 5rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75em;
  background: ${(props) => (props.isCopied ? '#269F13' : '#434343')};
  border: none;
  font-weight: 600;
  height: 100%;
  transition: ${TRANSITION};
  border-radius: 0 8px 8px 0;
  min-width: 2rem;
  border-left: 2px solid #191919;

  &:hover {
    background: ${(props) => (props.isCopied ? '#269F13' : '#363636')};

    svg {
      path {
        stroke: #fff;
      }
    }
  }

  &:active {
    background: #363636;
  }
`
export const LogoContainer = styled.div`
  width: 4em;

  svg {
    path {
      fill: ${(props) => props.theme.colors.logo};
    }
  }
`
