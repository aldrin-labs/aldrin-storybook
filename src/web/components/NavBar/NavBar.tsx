import React, { SFC, useState } from 'react'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'

import { client } from '@core/graphql/apolloClient'
import { Login } from '@core/containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import { Grid, Typography } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Hidden from '@material-ui/core/Hidden'

import {
  Nav,
  StyledToolbar,
  NavLinkButtonWrapper,
  NavBarWrapper,
  NavBreadcrumbTypography,
} from './NavBar.styles'
import Feedback from '@sb/components/Feedback'
import Logo from '@sb/components/Logo/Logo'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import Dropdown from '@sb/components/Dropdown'

import MainIcon from '@material-ui/icons/LineStyle'
import IndustryIcon from '@material-ui/icons/DonutLarge'
import RebalanceIcon from '@material-ui/icons/SwapHoriz'
import CorrelationIcon from '@material-ui/icons/ViewModule'
import OptimizationIcon from '@material-ui/icons/Assessment'
import { GET_FOLLOWING_PORTFOLIOS } from '@core/graphql/queries/portfolio/getFollowingPortfolios'
import { getPortfolioMainQuery } from '@core/graphql/queries/portfolio/main/serverPortfolioQueries/getPortfolioMainQuery'
import { marketsQuery } from '@core/graphql/queries/coinMarketCap/marketsQuery'
import { GET_FOLLOWING_SIGNALS_QUERY } from '@core/graphql/queries/signals/getFollowingSignals'
import { MASTER_BUILD } from '@core/utils/config'

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
  const pathnamePage = pathname.split('/')
  const page = pathnamePage[pathnamePage.length - 1]

  return (
    <Nav
      position="static"
      variant={{ hide: $hide, background: primary.main }}
      color="default"
      className="Navbar"
    >
      <StyledToolbar variant="dense">
        <Grid
          alignItems="center"
          style={{ height: '100%' }}
          container={true}
          alignContent={'stretch'}
        >
          <Hidden only={['sm', 'xs']}>
            <Grid item={true} md={2}>
              <Grid container={true} alignItems={'center'} wrap="nowrap">
                <Logo />
                <Grid style={{ marginLeft: '5%' }}>
                  <NavBreadcrumbTypography>{page}</NavBreadcrumbTypography>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
          <Grid style={{ height: '100%' }} item={true} md={6} sm={5}>
            <NavBarWrapper container={true}>
              {/* <NavLinkButton
                page={`portfolio`}
                component={Portfolio}
                pathname={pathname}
              >
                Portfolio
              </NavLinkButton> */}
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
                  !MASTER_BUILD && {
                    text: 'Optimizaton',
                    icon: <OptimizationIcon fontSize="small" />,
                    to: '/portfolio/optimization',
                  },
                ]}
              />

              {!MASTER_BUILD && (
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
                      onMouseOver: () => {
                        client.query({
                          query: GET_FOLLOWING_PORTFOLIOS,
                        })
                      },
                    },
                  ]}
                />
              )}

              {!MASTER_BUILD && (
                <>
                  <NavLinkButtonWrapper>
                    <NavLinkButton
                      page={`chart`}
                      component={Chart}
                      pathname={pathname}
                    >
                      Chart
                    </NavLinkButton>
                  </NavLinkButtonWrapper>

                  <NavLinkButtonWrapper>
                    <NavLinkButton
                      page={`market`}
                      component={Market}
                      pathname={pathname}
                      onMouseOver={() => {
                        client.query({
                          query: marketsQuery,
                        })
                      }}
                    >
                      Marketcap
                    </NavLinkButton>
                  </NavLinkButtonWrapper>

                  <NavLinkButton
                    page={`market`}
                    component={Market}
                    pathname={pathname}
                  >
                    Strategy
                  </NavLinkButton>
                </>
              )}
              <NavLinkButtonWrapper>
                <NavLinkButton
                  page={`signals`}
                  component={Signals}
                  pathname={pathname}
                  onMouseOver={() => {
                    client.query({
                      query: GET_FOLLOWING_SIGNALS_QUERY,
                    })
                  }}
                >
                  Signals
                </NavLinkButton>
              </NavLinkButtonWrapper>
            </NavBarWrapper>
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
      </StyledToolbar>
    </Nav>
  )
}

export const NavBar = compose(withTheme())(NavBarRaw)
