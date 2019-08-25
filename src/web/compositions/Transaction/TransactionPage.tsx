import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'

import GitTransactionCalendar from '@sb/components/GitTransactionCalendar'

import { Grid } from '@material-ui/core'
import {
  GridContainerTitle,
  TypographyContatinerTitle,
  GridItemContainer,
  TypographyAccountTitle,
  ContentGrid,
  GridShowHideDataContainer,
  GridAccountContainer,
  GridTableContainer,
  PortfolioSelectorWrapper,
  TransactionsPageMediaQuery,
} from './TransactionPage.styles'

import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistoryWrapper'

import Accounts from '@sb/components/Accounts/Accounts'
// import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import AccountsSlick from './AccountsSlick/AccountsSlick'
import ShowHideData from './ShowHideData/ShowHideData'

import TransactionsActionsStatistic from './TransactionsActionsStatistic/TransactionsActionsStatistic'
import WinLossRatio from './WinLossRatio'

import { withTheme } from '@material-ui/styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'

import SvgIcon from '@sb/components/SvgIcon'
import TransactionsAccountsBackground from '@icons/TransactionsAccountsBg.svg'

@withTheme()
class TransactionPage extends Component {
  render() {
    const {
      theme,
      hideSelector,
      portfolioKeyAndWalletsQuery: { myPortfolios },
    } = this.props

    const { keys, wallets } = myPortfolios[0].userSettings

    const color = theme.palette.secondary.main
    const login = true
    const isSideNavOpen = true

    const newKeys = Array.isArray(keys) ? keys : []
    const newWallets = Array.isArray(wallets) ? wallets : []
    const activeKeys = keys.filter((el) => el.selected)
    const activeWallets = wallets.filter((el) => el.selected)

    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length

    const isRebalance = false

    const onKeyToggle = this.onKeyToggle
    const onToggleAll = this.onToggleAll
    const onKeySelectOnlyOne = this.onKeySelectOnlyOne

    const baseCoin = 'USDT'
    const { portfolioAssetsData } = getPortfolioAssetsData(
      myPortfolios[0].portfolioAssets
    )

    // TODO: Account block, less more pointers, table fonts, titles

    return (
      <>
        <TransactionsPageMediaQuery />
        <Grid
          container
          justify="space-between"
          style={{
            padding: !hideSelector && '3rem 5% 8rem 5px',
            overflow: 'hidden',
            flexWrap: 'nowrap',
          }}
          // borderColor={`1px solid ${theme.palette.grey[theme.palette.type]}`}
        >
          {/* Accounts */}
          {!hideSelector && (
            <Grid item lg={2} md={2}>
              <GridAccountContainer
                borderColor={`1px solid ${
                  theme.palette.grey[theme.palette.type]
                }`}
              >
                <GridContainerTitle
                  bgColor={theme.palette.primary.dark}
                  content
                  alignItems="center"
                >
                  <TypographyContatinerTitle
                    textColor={theme.palette.text.subPrimary}
                  >
                    accounts
                  </TypographyContatinerTitle>
                </GridContainerTitle>
                <ContentGrid>
                  <PortfolioSelectorWrapper>
                    <SvgIcon
                      src={TransactionsAccountsBackground}
                      style={{
                        position: 'absolute',
                        top: '-4rem',
                        left: 0,
                      }}
                      width="100%"
                      height="20rem"
                    />
                    <TypographyAccountTitle>Portfolio</TypographyAccountTitle>
                    <AccountsSlick
                      path={this.props['0'].location.pathname}
                      myPortfolios={myPortfolios}
                      baseCoin={baseCoin}
                    />
                  </PortfolioSelectorWrapper>

                  <Grid>
                    <Accounts
                      {...{
                        color,
                        login,
                        isSideNavOpen,
                        isCheckedAll,
                        portfolioAssetsData,
                        baseCoin,
                        newKeys,
                        isRebalance,
                        onToggleAll,
                        onKeyToggle,
                        onKeySelectOnlyOne,
                      }}
                    />
                  </Grid>
                </ContentGrid>
                <GridShowHideDataContainer>
                  <ShowHideData />
                </GridShowHideDataContainer>
              </GridAccountContainer>
            </Grid>
          )}

          <GridItemContainer
            item
            lg={hideSelector ? 9 : 8}
            md={hideSelector ? 9 : 8}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: !hideSelector && '1.5rem',
            }}
          >
            <Grid item style={{ height: '100%' }}>
              {!hideSelector && <GitTransactionCalendar />}

              <GridTableContainer
                item
                lg={12}
                md={12}
                borderColor={`1px solid ${
                  theme.palette.grey[theme.palette.type]
                }`}
              >
                <TradeOrderHistory style={{ overflow: 'scroll' }} />
              </GridTableContainer>

              {/*
            <PortfolioMainChart
              title="Portfolio performance"
              style={{
                marginTop: '3%',
                marginLeft: 0,
                maxHeight: '235px',
                boxShadow: '0px 0px 8px rgba(10, 19, 43, 0.1)',
              }}
              marginTopHr="10px"
            />
            */}
            </Grid>
          </GridItemContainer>

          <GridItemContainer
            item
            lg={hideSelector ? 3 : 2}
            md={hideSelector ? 3 : 2}
            style={{
              boxShadow: 'none',
              border: 'none',
              paddingLeft: '1.5rem',
              paddingTop: hideSelector ? '4rem' : '1.75rem',
            }}
          >
            <TransactionsActionsStatistic />
            <WinLossRatio />
          </GridItemContainer>
        </Grid>
      </>
    )
  }

  onKeyToggle() {}

  onToggleAll() {}

  onKeySelectOnlyOne() {}
}

export default compose(
  queryRendererHoc({
    query: portfolioKeyAndWalletsQuery,
    name: 'portfolioKeyAndWalletsQuery',
    variables: { baseCoin: 'USDT' },
  })
)(TransactionPage)
