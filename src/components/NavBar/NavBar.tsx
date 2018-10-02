import React, { SFC } from 'react'
import styled from 'styled-components'

import { NavButton } from '@components/NavBar/NavButton'
import { Login } from '@containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import withTheme from '@material-ui/core/styles/withTheme'

export interface Props extends WithTheme {
  hide?: boolean
  pathname: string
}
// ToDo add grid
const NavBarRaw: SFC<Props> = ({
  theme: {
    shadows,
    palette: {
      type,
      getContrastText,
      secondary: { main },
      primary,
    },
  },
  pathname,
  hide = false,
}) => (
  <Nav hide={hide} background={primary.main} shadow={shadows[5]}>
    <Logo src="https://cdn.zeplin.io/5a9635a8ba64bb554c38ee24/assets/E47C7F75-58EF-4A5D-9F9C-8A43CCCDBF27.png" />
    <SNav>
      {/*<NavButton link="/" title="Home" exact />*/}
      {/*<NavButton link="/market" title="Coin Market" />*/}
      {/*<NavButton link="/profile" title="Profile" />*/}
      <NavButton
        active={pathname === '/portfolio'}
        color={getContrastText(primary.main)}
        link="/portfolio"
        title="Portfolio"
      />
      {/*<NavButton link="/screener" title="Screener" />*/}
      <NavButton
        active={pathname === '/chart'}
        color={getContrastText(primary.main)}
        link="/chart"
        title="Chart"
      />
    </SNav>
    <LoginWrapper>
      <Login mainColor={main} />
    </LoginWrapper>
  </Nav>
)

export const NavBar = withTheme()(NavBarRaw)

// TODO: fix z-index for drawer
const Nav = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 80px;
  box-shadow: ${(props: { shadow: string }) => props.shadow};
  align-items: center;
  background-color: ${(props: { background: string; shadow: string }) =>
    props.background};
  z-index: 1;
  ${(props: { hide: boolean; background: string }) =>
    props.hide
      ? `opacity: 0;
    position: absolute;
    z-index: -100;`
      : ''};

  @media (max-width: 840px) {
    justify-content: space-between;
    margin: 0;
    padding: 0 10px;
  }
`

const Logo = styled.img`
  padding: 25px 0 25px 32px;
  z-index: 1300;
  position: relative;

  @media (max-width: 768px) {
    margin: 0;
  }
`

const SNav = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  @media (max-width: 840px) {
    display: none;
  }
`

const LoginWrapper = styled.div`
  width: 10%;
  margin-right: 3%;
`
