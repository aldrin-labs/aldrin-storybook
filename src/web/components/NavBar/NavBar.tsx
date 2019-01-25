import React, { SFC } from 'react'
import { Login } from '@core/containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import { Toolbar, Button, Grid } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Hidden from '@material-ui/core/Hidden'

import { Nav } from './NavBar.styles'
import Feedback from '@sb/components/Feedback'
import styled from 'styled-components'
import Logo from '@sb/components/Logo/Logo'

export interface Props extends WithTheme {
  $hide?: boolean
  pathname: string
}

const Portfolio = (props: any) => <Link to="/portfolio" {...props} />
const Chart = (props: any) => <Link to="/chart" {...props} />
const Market = (props: any) => <Link to="/market" {...props} />

const NavBarRaw: SFC<Props> = ({
  theme: {
    palette: {
      type,
      common,
      secondary: { main },
      primary,
      divider,
    },
  },
  pathname,
  $hide = false,
}) => {
  const nonActiveButtonStyle =
    type === 'dark'
      ? { color: fade(common.white, 0.5), margin: '0.5rem 1rem' }
      : { color: fade(common.black, 0.5), margin: '0.5rem 1rem' }
  const activeButtonStyle = { margin: '0.5rem 1rem' }
  const createStyleForButton = (
    route: string,
    button: string
  ): { color?: string; margin?: string } =>
    route === button ? activeButtonStyle : nonActiveButtonStyle

  return (
    <Nav
      position="static"
      variant={{ hide: $hide, background: primary.main }}
      color="default"
      className="Navbar"
    >
      <Toolbar variant="dense" style={{ height: '48px' }}>
        <Grid alignItems="center" container={true} alignContent={'stretch'}>
          <Hidden only={['sm', 'xs']}>
            <Grid item={true} md={4}>
              <Grid container={true}>
                <Logo />
              </Grid>
            </Grid>
          </Hidden>
          <Grid item={true} md={3} sm={5}>
            <Grid
              justify="flex-end"
              container={true}
              style={{
                flexDirection: 'row',
                display: 'flex',
                flexWrap: 'nowrap',
              }}
            >
              <Button
                style={createStyleForButton(pathname, '/portfolio')}
                size="medium"
                component={Portfolio}
                color="default"
                variant="text"
              >
                {pathname === '/portfolio' && <Marker color={main} />}
                Portfolio
              </Button>

              <Button
                style={createStyleForButton(pathname, '/chart')}
                component={Chart}
                size="medium"
                variant="text"
                color="default"
              >
                {pathname === '/chart' && <Marker color={main} />}
                Chart
              </Button>
              <Button
                style={createStyleForButton(pathname, '/market')}
                component={Market}
                size="medium"
                variant="text"
                color="default"
              >
                {pathname === '/market' && <Marker color={main} />}
                Market
              </Button>
            </Grid>
          </Grid>

          <Grid item={true} md={5} sm={7}>
            <Grid
              justify="flex-end"
              wrap="nowrap"
              direction={'row'}
              container={true}
            >
              <Hidden only={['sm', 'xs']}>
                <Feedback borderColor={fade(divider, 0.5)} />
              </Hidden>
              <Hidden only="xs">
                <Login mainColor={main} />
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </Nav>
  )
}

const Marker = styled.span`
  width: 28px;
  height: 6px;
  border-radius: 6px;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
  bottom: -9px;
`

export const NavBar = withTheme()(NavBarRaw)
