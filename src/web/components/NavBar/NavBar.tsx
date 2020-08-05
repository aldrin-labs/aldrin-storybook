import React, { SFC, useState } from 'react'
import { withApollo, graphql } from 'react-apollo'
import { compose } from 'recompose'

import { client } from '@core/graphql/apolloClient'
import { LoginComponent as Login } from '@sb/components/Login'
import { WithTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'
import { Grid, Typography } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'

import { handleLogout, checkLoginStatus } from '@core/utils/loginUtils'
import Hidden from '@material-ui/core/Hidden'
import { syncStorage } from '@storage'

import {
  Nav,
  StyledToolbar,
  NavLinkButtonWrapper,
  NavBarWrapper,
  NavBreadcrumbTypography,
} from './NavBar.styles'

import Logo from '@sb/components/Logo/Logo'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import Dropdown from '@sb/components/Dropdown'

import MainIcon from '@material-ui/icons/LineStyle'
import IndustryIcon from '@material-ui/icons/DonutLarge'
import RebalanceIcon from '@material-ui/icons/SwapHoriz'

import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { marketsQuery } from '@core/graphql/queries/coinMarketCap/marketsQuery'
import { GET_MARKET_TYPE } from '@core/graphql/queries/chart/getMarketType'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { GET_FOLLOWING_SIGNALS_QUERY } from '@core/graphql/queries/signals/getFollowingSignals'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { LOGOUT } from '@core/graphql/mutations/login'

import {
  prefetchSpotTransactions,
  prefetchFuturesTransactions,
  prefetchRebalance,
  prefetchSpotChart,
  prefetchFuturesChart,
  prefetchProfileAccounts,
} from '@core/utils/prefetching'

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
    palette: { primary },
  },
  pathname,
  $hide = false,
  logoutMutation,
  persistorInstance,
  changeCurrencyPairMutation,
}) => {
  const [selectedMenu, selectMenu] = useState<string | undefined>(undefined)
  const pathnamePage = pathname.split('/')
  let page = pathnamePage[pathnamePage.length - 1]
  let joyridePage = null

  const logout = () => {
    handleLogout(logoutMutation, persistorInstance)
  }

  if (/chart/.test(pathname)) {
    const isSPOTMarket = /spot/.test(pathname)

    joyridePage = 'chartPage'
    page = isSPOTMarket ? 'spot trading' : 'futures trading'
  }

  if (/confirmWithdrawal/.test(pathname)) {
    page = 'Withdrawal'
  }

  if (/login/.test(pathname)) {
    page = 'Log in'
  }

  if (/signup/.test(pathname)) {
    page = 'Sign up'
  }

  if (/disableaccount/.test(pathname)) {
    page = 'Disable Account'
  }

  if (/transactions\/spot/.test(pathname)) {
    page = 'Transactions Spot'
    joyridePage = 'transactionPage'
  }

  if (/transactions\/futures/.test(pathname)) {
    page = 'Transactions Futures'
    joyridePage = 'transactionPage'
  }

  if (/internal/.test(pathname)) {
    page = 'Internal Transfer'
  }

  if (/main/.test(pathname)) {
    joyridePage = 'portfolioMain'
  }

  const loginStatus = checkLoginStatus()
  const notAuthPages = page === 'Log in' || page === 'Sign up'

  return (
    <Nav
      variant={{ hide: $hide, background: primary.main }}
      color="default"
      className="Navbar"
    >
      <StyledToolbar variant="dense">
        <Grid
          alignItems="center"
          style={{ height: '100%' }}
          container={true}
          wrap="nowrap"
          alignContent={'stretch'}
        >
          <Hidden only={['sm', 'xs']}>
            <Grid
              item={true}
              style={{
                display: 'flex',
                height: '100%',
                borderRight: '.1rem solid #e0e5ec',
              }}
            >
              <Grid
                container={true}
                alignItems={'center'}
                wrap="nowrap"
                style={{}}
              >
                <Logo />
              </Grid>
            </Grid>
          </Hidden>
          <Grid style={{ width: '100%', textAlign: 'center' }}>
            <NavBreadcrumbTypography>{page}</NavBreadcrumbTypography>
          </Grid>
          <Grid style={{ height: '100%' }} item={true} key={'navBarGrid'}>
            <NavBarWrapper container={true} key={'NavBarWrapper'}>
              {/* <NavLinkButton
                page={`portfolio`}
                component={Portfolio}
                pathname={pathname}
              >
                Portfolio
              </NavLinkButton> */}
              <Dropdown
                id="portfolio-menu"
                key="portfolio-menu"
                buttonText="Portfolio"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  {
                    text: 'Wallet',
                    icon: <MainIcon fontSize="small" />,
                    to: '/portfolio/main',
                    onMouseOver: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      client.query({
                        query: getPortfolioAssets,
                        variables: { baseCoin: 'USDT', innerSettings: true },
                      })
                    },
                  },
                  {
                    text: 'Spot transactions',
                    icon: <IndustryIcon fontSize="small" />,
                    to: '/portfolio/transactions/spot',
                    onMouseOver: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      prefetchSpotTransactions()
                    },
                  },
                  {
                    text: 'Futures transactions',
                    icon: <IndustryIcon fontSize="small" />,
                    to: '/portfolio/transactions/futures',
                    onMouseOver: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      prefetchFuturesTransactions()
                    },
                  },
                  {
                    text: (
                      <span>
                        Rebalance{' '}
                        <span
                          style={{
                            fontSize: '.9rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '.05rem',
                            color: 'rgb(11, 31, 209)',
                          }}
                        >
                          beta
                        </span>
                      </span>
                    ),
                    icon: <RebalanceIcon fontSize="small" />,
                    to: '/portfolio/rebalance',
                    onMouseOver: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      prefetchRebalance()
                    },
                  },
                  // !MASTER_BUILD && {
                  //   text: 'Optimizaton',
                  //   icon: <OptimizationIcon fontSize="small" />,
                  //   to: '/portfolio/optimization',
                  // },
                ]}
              />
              {/* <Dropdown
                id="transaction-menu"
                key="transaction-menu"
                buttonText="Transactions"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  
                  // !MASTER_BUILD && {
                  //   text: 'Optimizaton',
                  //   icon: <OptimizationIcon fontSize="small" />,
                  //   to: '/portfolio/optimization',
                  // },
                ]}
              /> */}

              {/* {!MASTER_BUILD && (
                <Dropdown
                  id="explore-menu"
                  key="explore-menu"
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
              )} */}

              <Dropdown
                id="chart-page"
                key="chart-page"
                buttonText="Trading"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  {
                    text: 'Spot market',
                    to: '/chart/spot/BTC_USDT',
                    onMouseOver: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      prefetchSpotChart()
                    },
                  },
                  {
                    text: 'Futures market',
                    to: '/chart/futures/BTC_USDT',
                    onClick: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      prefetchFuturesChart()
                      changeCurrencyPairMutation({
                        variables: {
                          pairInput: {
                            pair: 'BTC_USDT',
                          },
                        },
                      })
                    },
                  },
                ]}
              />

              {!MASTER_BUILD && (
                <NavLinkButtonWrapper key="market-wrapper">
                  <NavLinkButton
                    key="market-2"
                    page={`market`}
                    component={Market}
                    pathname={pathname}
                    onMouseOver={() => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      client.query({
                        query: marketsQuery,
                      })
                    }}
                  >
                    Marketcap
                  </NavLinkButton>
                </NavLinkButtonWrapper>
              )}
              {!MASTER_BUILD && (
                <NavLinkButtonWrapper key="signals-wrapper">
                  <NavLinkButton
                    key="signals"
                    page={`signals`}
                    component={Signals}
                    pathname={pathname}
                    onMouseOver={() => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      client.query({
                        query: GET_FOLLOWING_SIGNALS_QUERY,
                      })
                    }}
                  >
                    Signals
                  </NavLinkButton>
                </NavLinkButtonWrapper>
              )}
              <Dropdown
                id="profile-page"
                key="profile-page"
                buttonText="Settings"
                selectedMenu={selectedMenu}
                selectActiveMenu={selectMenu}
                items={[
                  // {
                  //   text: 'Accounts',
                  //   to: '/profile/accounts',
                  //   onMouseOver: () => {
                  //     if (notAuthPages || !loginStatus) {
                  //       return
                  //     }

                  //     prefetchProfileAccounts()
                  //   },
                  // },
                  {
                    text: 'Settings',
                    to: '/profile/settings',
                  },
                  {
                    text: 'Deposit',
                    to: '/profile/deposit',
                  },
                  {
                    text: 'Withdrawal',
                    to: '/profile/withdrawal',
                  },
                  {
                    text: 'Internal Transfer',
                    to: '/profile/internal',
                  },
                  {
                    text: 'API',
                    to: '/profile/api',
                  },
                  {
                    text: 'Telegram',
                    to: '/profile/telegram',
                  },
                  {
                    text: 'Referral',
                    to: '/profile/referral',
                  },
                  {
                    text: 'Disable Account',
                    to: '/profile/disableaccount',
                  },
                  {
                    text: 'Log out',
                    to: `/login?callbackURL=${pathname}`,
                    onClick: logout,
                    style: {
                      color: '#DD6956',
                    },
                  },
                ]}
              />
            </NavBarWrapper>
          </Grid>

          <Grid item={true} style={{ display: 'flex', height: '100%' }}>
            <Grid
              justify="flex-end"
              wrap="nowrap"
              direction={'row'}
              container={true}
            >
              {/* <Hidden only={['sm', 'xs']}>
                <Feedback borderColor={fade(divider, 0.5)} />
              </Hidden> */}
              <Hidden only="xs">
                <Login joyridePage={joyridePage} />
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </StyledToolbar>
    </Nav>
  )
}

export const NavBar = compose(
  withTheme(),
  withApolloPersist,
  graphql(LOGOUT, { name: 'logoutMutation' }),
  graphql(GET_MARKET_TYPE, { name: 'marketTypeData' }),
  graphql(CHANGE_CURRENCY_PAIR, {
    name: 'changeCurrencyPairMutation',
  })
)(NavBarRaw)
