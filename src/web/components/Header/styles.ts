import {
  COLORS,
  BREAKPOINTS,
  BORDER_RADIUS,
  FONT_SIZES,
  TRANSITION,
  UCOLORS,
} from '@variables/variables'
import { rgba, em } from 'polished'
import { NavLink as RouterNavLink } from 'react-router-dom'
import styled from 'styled-components'

// TODO: remove dat

import { Button } from '../Button'
import { Text } from '../Typography'

export const HeaderWrap = styled.header`
  display: flex;
  flex-direction: row;
  height: 76px;
  background: ${(props) => props.theme.colors.header};
  padding: 0 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props) => props.theme.colors.border1};
`

interface ShowHideProps {
  show?: keyof typeof BREAKPOINTS
  hide?: keyof typeof BREAKPOINTS
}

interface LinkProps extends ShowHideProps {
  $new?: boolean
  $left?: boolean
  $beta?: boolean
}

export const NavLink = styled(RouterNavLink)<LinkProps>`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.8em;
  padding: 4px 0;
  margin: 0;
  text-align: ${(props: LinkProps) => (props.$left ? 'left' : 'center')};
  color: ${(props) => props.theme.colors.white1};
  background: transparent;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  transition: 0.3s;

  svg {
    path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }

  svg + * {
    margin-left: 0.2em;
  }

  &.dropdown {
    &:hover {
      border-bottom: none;
    }
  }

  &.selected-from-dropdown {
    color: ${(props) => props.theme.colors.white1};

    svg {
      path {
        fill: ${(props) => props.theme.colors.white1};
      }
    }
  }

  &:hover {
    color: ${(props) => props.theme.colors.white1};

    svg path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }

  &.selected {
    color: ${(props) => props.theme.colors.white1};
    border-bottom: 1px solid ${(props) => props.theme.colors.white1};
    transition: all ease-in 0.2s;
    font-weight: 600;

    svg {
      path {
        fill: ${(props) => props.theme.colors.white1};
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
    props.$new
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
    props.$beta
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
  display: flex;
  align-items: center;
  margin-left: 0.5em;
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
`

export const DropdownInner = styled.div`
  min-width: 6em;
  background: ${(props) => props.theme.colors.white3};
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${em('14px')};
  width: ${em('144px', '14px')};
  background-color: ${(props) => rgba(props.theme.colors.blue3, 0.15)};
  border: none;
  font-weight: 600;
  height: ${em('40px', '14px')};
  transition: ${TRANSITION};
  color: ${UCOLORS.blue2};

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.blue3, 0.1)};
  }
`

export const WalletDataContainer = styled.div`
  border-radius: ${BORDER_RADIUS.md};
  height: 40px;
  width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.white5};

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
  margin-left: 0.4em;
`

export const DownArrowWrapper = styled.div`
  margin-left: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const WalletName = styled(Text)`
  font-size: 0.6em;
  line-height: 1.3;
  margin: 0;
  color: ${(props) => props.theme.colors.white1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`

export const WalletAddress = styled(WalletName)`
  color: ${(props) => props.theme.colors.white1};
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
  font-size: 12px;
  color: ${(props) => props.theme.colors.white1};
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.7125em;
  }
`

export const Wrap = styled.div``

export const WalletDisconnectBlock = styled.div`
  width: 100%;
  height: 5rem;
`

type CopyButton = {
  isCopied: boolean
}

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
