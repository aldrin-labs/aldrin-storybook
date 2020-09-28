import React, { SFC, useState } from 'react'
import { withApollo, graphql } from 'react-apollo'
import { compose } from 'recompose'
import Dropdown from '@sb/components/Dropdown'
import ArrowBottom from '@icons/arrowBottom.svg'
import SvgIcon from '@sb/components/SvgIcon'

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
import TotalBalance from '@sb/components/NavBar/TotalBalance'
import NavBarProfileSelector from '@sb/components/NavBar/NavBarProfileSelector'

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
  prefetchPortfolio,
} from '@core/utils/prefetching'

import { MASTER_BUILD } from '@core/utils/config'

export interface Props extends WithTheme {
  $hide?: boolean
  pathname: string
}

const isSpotOrRebalance = (pathname: any) => {
  return pathname.includes('spot') || pathname.includes('rebalance')
}

const Portfolio = (props: any) => {
  return (
    <Link
      to={`/portfolio/main/${
        isSpotOrRebalance(props.pathname) ? 'spot' : 'futures'
      }`}
      {...props}
    />
  )
}

const Chart = (props: any) => {
  return (
    <Link
      to={`/chart/${isSpotOrRebalance(props.pathname) ? 'spot' : 'futures'}`}
      {...props}
    />
  )
}

const Rebalance = (props: any) => <Link to="/portfolio/rebalance" {...props} />
const Transactions = (props: any) => {
  return (
    <Link
      to={`/portfolio/transactions/${
        isSpotOrRebalance(props.pathname) ? 'spot' : 'futures'
      }`}
      {...props}
    />
  )
}

const Market = (props: any) => <Link to="/market" {...props} />
const Signals = (props: any) => <Link to="/signals" {...props} />
const MarketType = (props: any) => {
  const isChart = /chart/.test(props.pathname)
  const isTransactions = /transactions/.test(props.pathname)
  const isPortfolio = /main/.test(props.pathname)

  const chartPair = props.pathname.split('/')[3]
  const url = isChart
    ? `/chart/${props.marketName}/${chartPair}`
    : isTransactions
    ? `/portfolio/transactions/${props.marketName}`
    : isPortfolio
    ? `/portfolio/main/${props.marketName}`
    : `/portfolio/main/${props.marketName}`

  return <Link to={url} {...props} />
}

const NavBarRaw: SFC<Props> = ({
  theme: {
    palette: { primary },
  },
  theme,
  pathname,
  $hide = false,
  logoutMutation,
  persistorInstance,
  changeCurrencyPairMutation,
}) => {
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
  const [selectedMenu, selectMenu] = useState<string | undefined>(undefined)

  const isActivePage = new RegExp(page, 'i').test(pathname)
  const isSpot = /spot/.test(pathname)
  const isRebalance = /rebalance/.test(pathname)

  return (
    <Nav
      theme={theme}
      variant={{ hide: $hide }}
      color="default"
      className="Navbar"
    >
      <StyledToolbar theme={theme} variant="dense">
        <Grid
          alignItems="center"
          style={{ height: '100%', width: '50%' }}
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
                borderRight: theme.palette.border.main,
                width: '22rem',
              }}
            >
              <Grid
                container={true}
                alignItems={'center'}
                wrap="nowrap"
                style={{
                  minWidth: '25rem',
                  padding: '.5rem 1rem',
                  margin: 'auto auto',

                  width: '20rem',
                }}
              >
                <Logo theme={theme} />
              </Grid>
            </Grid>
          </Hidden>
          <Grid
            item={true}
            container={true}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '100%',
              borderRight: theme.palette.border.main,
              width: 'auto',
              flexWrap: 'nowrap',
            }}
          >
            <Dropdown
              component={MarketType}
              theme={theme}
              id="spot-page"
              marketName="spot"
              buttonText={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '10rem',
                    justifyContent: 'center',
                  }}
                >
                  {'Spot'}
                </div>
              }
              selectedMenu={selectedMenu}
              key="spot"
              page={isRebalance ? `rebalance` : `spot`}
              isActivePage={isActivePage}
              pathname={pathname}
              selectActiveMenu={selectMenu}
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                prefetchSpotChart()
                prefetchSpotTransactions()
              }}
              items={[
                {
                  text: 'Exchange',
                  to: '/chart/spot/BTC_USDT',
                },
                {
                  text: 'Portfolio',
                  to: '/portfolio/main/spot',
                  onMouseOver: () => {
                    if (notAuthPages || !loginStatus) {
                      return
                    }

                    prefetchPortfolio()
                  },
                },
                {
                  text: 'Perfomance',
                  to: '/portfolio/transactions/spot',
                },
                {
                  text: 'Rebalance',
                  to: '/portfolio/rebalance',
                  onMouseOver: () => {
                    if (notAuthPages || !loginStatus) {
                      return
                    }

                    prefetchRebalance()
                  },
                },
              ]}
            />

            <Dropdown
              component={MarketType}
              theme={theme}
              pathname={pathname}
              id="futures-page"
              key="futures-page"
              marketName="futures"
              page={'futures'}
              buttonText={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '10rem',
                    justifyContent: 'center',
                  }}
                >
                  {'Futures'}
                </div>
              }
              selectedMenu={selectedMenu}
              selectActiveMenu={selectMenu}
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                prefetchFuturesChart()
                prefetchFuturesTransactions()
              }}
              items={[
                {
                  text: 'Exchange',
                  to: '/chart/futures/BTC_USDT',
                },
                {
                  text: 'Portfolio',
                  to: '/portfolio/main/futures',
                },
                {
                  text: 'Perfomance',
                  to: '/portfolio/transactions/futures',
                },
              ]}
            />
          </Grid>
          {/* <NavLinkButtonWrapper
            theme={theme}
            key="spot-wrapper"
            onMouseOver={() => {
              if (notAuthPages || !loginStatus) {
                return
              }

              prefetchSpotChart()
              prefetchSpotTransactions()
            }}
          >
            <NavLinkButton
              key="spot"
              page={`spot`}
              marketName={'spot'}
              component={MarketType}
              pathname={pathname}
            >
              Spot
            </NavLinkButton>
          </NavLinkButtonWrapper> */}

          {/* <NavLinkButtonWrapper
            theme={theme}
            key="futures-wrapper"
            onMouseOver={() => {
              if (notAuthPages || !loginStatus) {
                return
              }

              prefetchFuturesChart()
              prefetchFuturesTransactions()
            }}
          >
            <NavLinkButton
              key="futures"
              page={`futures`}
              marketName={'futures'}
              component={MarketType}
              pathname={pathname}
            >
              Futures
            </NavLinkButton>
          </NavLinkButtonWrapper> */}
        </Grid>
        <Grid
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            margin: 'auto auto',
          }}
          item={true}
          key={'navBarGrid'}
        >
          <NavBarWrapper>
            {/* <Dropdown
                theme={theme}
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
                            color: theme.palette.blue.main,
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

                     
                    },
                  },
                ]}
              /> */}
            {/* <Dropdown
                theme={theme}
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
                      
                    },
                  },
                  {
                    text: 'Futures market',
                    to: '/chart/futures/BTC_USDT',
                    onClick: () => {
                      if (notAuthPages || !loginStatus) {
                        return
                      }

                      
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
              /> */}
            <NavLinkButtonWrapper
              theme={theme}
              key="trading-wrapper"
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                client.query({
                  query: getPortfolioAssets,
                  fetchPolicy: 'cache-first',
                  variables: { baseCoin: 'USDT', innerSettings: true },
                })
              }}
            >
              <NavLinkButton
                key="trading"
                page={`chart`}
                component={Chart}
                pathname={pathname}
              >
                Exchange
              </NavLinkButton>
            </NavLinkButtonWrapper>
            <NavLinkButtonWrapper
              theme={theme}
              key="portfolio-wrapper"
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                prefetchPortfolio()
              }}
            >
              <NavLinkButton
                key="portfolio"
                page={`main`}
                component={Portfolio}
                pathname={pathname}
              >
                Portfolio
              </NavLinkButton>
            </NavLinkButtonWrapper>
            <NavLinkButtonWrapper
              theme={theme}
              key="performance-wrapper"
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                prefetchSpotTransactions()
                prefetchFuturesTransactions()
              }}
            >
              <NavLinkButton
                key="performance"
                page={`transactions`}
                component={Transactions}
                pathname={pathname}
              >
                Performance
              </NavLinkButton>
            </NavLinkButtonWrapper>
            {(isSpot || isRebalance) && (
              <NavLinkButtonWrapper
                theme={theme}
                key="rebalance-wrapper"
                onMouseOver={() => {
                  if (notAuthPages || !loginStatus) {
                    return
                  }

                  prefetchRebalance()
                }}
              >
                <NavLinkButton
                  key="rebalance"
                  page={`rebalance`}
                  component={Rebalance}
                  pathname={pathname}
                >
                  Rebalance
                </NavLinkButton>
              </NavLinkButtonWrapper>
            )}
            {/* {isRebalance && (
              <NavLinkButtonWrapper
                theme={theme}
                key="rebalance-wrapper"
                onMouseOver={() => {
                  if (notAuthPages || !loginStatus) {
                    return
                  }

                  prefetchRebalance()
                }}
              >
                <NavLinkButton
                  key="rebalance"
                  page={`rebalance`}
                  component={Rebalance}
                  pathname={pathname}
                >
                  Rebalance
                </NavLinkButton>
              </NavLinkButtonWrapper>
            )} */}
          </NavBarWrapper>
        </Grid>

        {loginStatus && (
          <>
            <TotalBalance theme={theme} />
            <NavBarProfileSelector
              onMouseOver={() => {
                if (notAuthPages || !loginStatus) {
                  return
                }

                prefetchProfileAccounts()
              }}
              logout={logout}
              pathname={pathname}
              theme={theme}
            />
          </>
        )}

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
              <Login theme={theme} joyridePage={joyridePage} />
            </Hidden>
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
