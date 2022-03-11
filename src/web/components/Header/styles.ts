import {
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
  background: ${COLORS.mainBlack};
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

export const NavLink = styled(RouterNavLink)<LinkProps>`
  text-decoration: none;
  font-size: 0.8em;
  padding: 4px 0;
  margin: 0;
  text-align: ${(props: LinkProps) => (props.left ? 'left' : 'center')};
  color: ${COLORS.primaryGray};
  background: transparent;
  transition: all ease-in 0.2s;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;

  &.dropdown {
    &:hover {
      border-bottom: none;
    }
  }

  &.selected-from-dropdown {
    color: ${COLORS.activeWhite};
    svg {
      path {
        fill: ${COLORS.activeWhite};
      }
    }
  }

  svg,
  img {
    margin: 0 0.5rem;
  }

  &:hover {
    color: ${COLORS.activeWhite};
    transition: all ease-in 0.2s;
    svg {
      path {
        fill: ${COLORS.activeWhite};
      }
    }
  }

  &.selected {
    color: ${COLORS.activeWhite};
    border-bottom: 1px solid ${COLORS.activeWhite};
    transition: all ease-in 0.2s;
    svg {
      path {
        fill: ${COLORS.activeWhite};
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
  background: ${COLORS.defaultGray};
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
  background-color: ${COLORS.primaryBlue};
  border: none;
  font-weight: 600;
  height: 5rem;
  transition: ${TRANSITION};

  &:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      ${COLORS.primary};
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
  width: 17rem;
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
    transition: all 1s ease-out;
  }

  &:hover {
    button {
      display: block;
      transition: all 1s ease-out;
    }
  }

  div {
    display: flex;
    transition: all 1s ease-out;
  }

  &:hover {
    div {
      display: none;
      transition: all 1s ease-out;
    }
  }
`

export const WalletData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  height: 5rem;
  border-radius: ${BORDER_RADIUS.md};
  background: ${COLORS.defaultGray};
  align-items: center;
  img {
    border-radius: 50%;
  }

  @media (max-width: 1200px) {
    img {
      width: 20px;
      height: 20px;
    }
  }
`
export const Column = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;
`

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
  font-weight: 600;
  display: block;
  font-size: ${FONT_SIZES.sm};

  @media (max-width: 1200px) {
    font-size: ${FONT_SIZES.es};
  }
`

export const WalletDisconnectButton = styled(Button)`
  width: 100%;
  padding: 10px 20px;
  font-size: 0.75em;
  background-color: ${COLORS.newOrange};
  border: none;
  font-weight: 600;
  height: 5rem;
  transition: ${TRANSITION};

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
  color: ${COLORS.newGreen};
  font-weight: 600;
  @media (max-width: 1200px) {
    font-size: 0.6125em;
  }
`

export const Wrap = styled.div`
  margin: 0 10px;

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin: 0 48px;
  }
`
