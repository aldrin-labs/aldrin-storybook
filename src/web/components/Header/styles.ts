import {
  COLORS,
  BREAKPOINTS,
  BORDER_RADIUS,
  FONT_SIZES,
  TRANSITION,
  UCOLORS,
  FONTS,
  SIZE,
} from '@variables/variables'
import { rgba, em } from 'polished'
import { NavLink as RouterNavLink } from 'react-router-dom'
import styled from 'styled-components'

// TODO: remove dat

import { Button } from '../Button'
import { Row } from '../Layout'
import { Text } from '../Typography'

export const Wrapper = styled.header`
  font-family: ${FONTS.main};
  font-size: ${SIZE.fontSize};
`

export const Container = styled.div`
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
    margin-left: 0.4em;
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
  background: ${(props) => props.theme.colors.white5};
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 0.5em;
  border-radius: ${BORDER_RADIUS.md};

  & ${NavLink} {
    margin: 4px;

    &:hover {
      opacity: 0.5;
    }
  }
`

export const WalletButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${em('14px')};
  width: ${em('144px', '14px')};
  background-color: ${(props) => props.theme.colors.white6};
  border: none;
  font-weight: 600;
  height: ${em('40px', '14px')};
  transition: ${TRANSITION};
  color: ${UCOLORS.blue2};

  @media (max-width: ${BREAKPOINTS.xs}) {
    font-size: ${em('11px')};
    height: ${em('40px', '11px')};
    width: auto;
  }

  &:hover {
    background-color: ${(props) => rgba(props.theme.colors.blue3, 0.1)};
  }
`

export const WalletDataContainer = styled.div`
  border-radius: ${BORDER_RADIUS.md};
  height: 40px;
  width: 140px;
  display: flex;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.white5};

  @media (max-width: ${BREAKPOINTS.md}) {
    width: auto;
  }

  img {
    @media (max-width: ${BREAKPOINTS.md}) {
      display: none;
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.white4};
  }

  .wallet-data {
    display: flex;
  }
`

export const WalletData = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: ${BORDER_RADIUS.md};
  align-items: center;
`

export const AstronautImage = styled.img`
  border-radius: 50%;
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

export const BalanceTitle = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.white1};
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.7125em;
  }
`

export const WalletDisconnectBlock = styled.div`
  width: 100%;
  height: 100%;
`

export const LogoContainer = styled.div`
  width: 4em;

  svg {
    path {
      fill: ${(props) => props.theme.colors.logo};
    }
  }
`

export const ArrowDownIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5em;
`

export const Left = styled.div`
  display: flex;
  flex: 1;
`

export const Right = styled.div`
  display: flex;
`

export const WalletIconContainer = styled(Row)`
  margin-right: 0.3em;
  align-items: center;
`
