import React, { SFC, useState } from 'react'
import { Login } from '@core/containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import { Toolbar, Grid, Typography } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Hidden from '@material-ui/core/Hidden'

import { Nav } from './NavBar.styles'
import Feedback from '@sb/components/Feedback'
import Logo from '@sb/components/Logo/Logo'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import Dropdown from '@sb/components/Dropdown'

import MainIcon from '@material-ui/icons/LineStyle'
import IndustryIcon from '@material-ui/icons/DonutLarge'
import RebalanceIcon from '@material-ui/icons/SwapHoriz'
import CorrelationIcon from '@material-ui/icons/ViewModule'
import OptimizationIcon from '@material-ui/icons/Assessment'

export interface Props extends WithTheme {
  $hide?: boolean
  pathname: string
}

const Portfolio = (props: any) => <Link to="/portfolio" {...props} />
const Chart = (props: any) => <Link to="/chart" {...props} />
const Market = (props: any) => <Link to="/market" {...props} />
const Signals = (props: any) => <Link to="/signals" {...props} />

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
  const [selectedMenu, selectMenu] = useState<string | undefined>(undefined)
  console.log(MainIcon, IndustryIcon, RebalanceIcon)
  console.log('pathname', pathname)

  const pathnamePage = pathname.split('/')
  const page = pathnamePage[pathnamePage.length - 1]

  return (
    <Nav
      position="static"
      variant={{ hide: $hide, background: primary.main }}
      color="default"
      className="Navbar"
    >
      <Toolbar
        variant="dense"
        style={{ height: '3rem', borderBottom: '1px solid #E0E5EC' }}
      >
        <Grid alignItems="center" container={true} alignContent={'stretch'}>
          <Hidden only={['sm', 'xs']}>
            <Grid item={true} md={2}>
              <Grid container={true} alignItems={'center'}>
                <Logo />
                <Grid style={{ marginLeft: '5%', marginBottom: '4px' }}>
                  <Typography
                    style={{
                      textTransform: 'capitalize',
                      borderLeft: '1px solid #7284A0',
                      paddingLeft: '.75rem',
                      fontSize: '1.25rem',
                      lineHeight: '2.5rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    {page}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
          <Grid item={true} md={6} sm={5}>
            <Grid
              justify="flex-end"
              container={true}
              style={{
                flexDirection: 'row',
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
              }}
            >
              {/*<NavLinkButton
                page={`portfolio`}
                component={Portfolio}
                pathname={pathname}
              >
                Portfolio
              </NavLinkButton>*/}
              <Dropdown
                id="portfolio-menu"
                buttonText="Portfolio"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  {
                    text: 'P&L',
                    icon: <MainIcon fontSize="small" />,
                    to: '/portfolio/main',
                  },
                  {
                    text: 'Transactions',
                    icon: <IndustryIcon fontSize="small" />,
                    to: '/portfolio/transactions',
                  },
                  {
                    text: 'Rebalance',
                    icon: <RebalanceIcon fontSize="small" />,
                    to: '/portfolio/rebalance',
                  },
                  // { text: 'Optimizaton', icon: <OptimizationIcon fontSize="small" />, to: '/portfolio/optimization' },
                ]}
              />

              <Dropdown
                id="explore-menu"
                buttonText="Explore"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  {
                    text: 'Industry',
                    icon: <MainIcon fontSize="small" />,
                    to: '/portfolio/industry',
                  },
                  // { text: 'Correlation', icon: <CorrelationIcon fontSize="small" />, to: '/portfolio/correlation' },
                  // { text: 'Index', icon: <RebalanceIcon fontSize="small" />, to: '/' },
                  {
                    text: 'Social Portfolio',
                    icon: <OptimizationIcon fontSize="small" />,
                    to: '/portfolio/social',
                  },
                ]}
              />

              <Dropdown
                id="chart-menu"
                buttonText="Chart"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  { text: 'Simple Terminal', icon: null, to: '/chart' },
                  // { text: 'Advanced Terminal', icon: null, to: '/chart' },
                ]}
              />

              <NavLinkButton
                page={`market`}
                component={Market}
                pathname={pathname}
              >
                Marketcap
              </NavLinkButton>

              {/*<NavLinkButton*/}
              {/*page={`market`}*/}
              {/*component={Market}*/}
              {/*pathname={pathname}*/}
              {/*>*/}
              {/*Strategy*/}
              {/*</NavLinkButton>*/}

              {/*<NavLinkButton*/}
              {/*page={`signals`}*/}
              {/*component={Signals}*/}
              {/*pathname={pathname}*/}
              {/*>*/}
              {/*Signals*/}
              {/*</NavLinkButton>*/}
            </Grid>
          </Grid>

          <Grid item={true} md={4} sm={7}>
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
