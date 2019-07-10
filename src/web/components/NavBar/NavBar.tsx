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
import Logo from '@sb/components/Logo/Logo'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'

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
  theme,
  pathname,
  $hide = false,
}) => {

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
              <NavLinkButton
                page={`portfolio`}
                component={Portfolio}
                pathname={pathname}
              >
                Portfolio
              </NavLinkButton>
              <NavLinkButton
                page={`chart`}
                component={Chart}
                pathname={pathname}
              >
                Chart
              </NavLinkButton>
              <NavLinkButton
                page={`market`}
                component={Market}
                pathname={pathname}
              >
                Market
              </NavLinkButton>
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
                <Login />
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </Nav>
  )
}

export const NavBar = withTheme()(NavBarRaw)
