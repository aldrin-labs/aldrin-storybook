import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'
import GitTransactionCalendar from '@sb/components/GitTransactionCalendar'

import { Grid, Typography } from '@material-ui/core'
import {
  GridContainerTitle,
  TypographyContatinerTitle,
  GridItemContainer,
  TypographyAccountTitle,
  ContentGrid,
  TypographyTitle,
  GridShowHideDataContainer,
  GridAccountContainer,
  GridTableContainer,
  TransactionsTitle,
  PortfolioSelectorWrapper
} from './TransactionPage.styles'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'

import ChoosePeriod from '@sb/components/ChoosePeriod/ChoosePeriod'
import Accounts from '@sb/components/Accounts/Accounts'
// import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import AccountsSlick from './AccountsSlick/AccountsSlick'
import ShowHideData from './ShowHideData/ShowHideData'

import TransactionsActionsStatistic from './TransactionsActionsStatistic/TransactionsActionsStatistic'
import WinLossRatio from './WinLossRatio/WinLossRatio'

import { withTheme } from '@material-ui/styles'

import SvgIcon from '@sb/components/SvgIcon'
import TransactionsAccountsBackground from '@icons/TransactionsAccountsBg.svg'

const TransactionPageMediaQuery = createGlobalStyle`
  @media only screen and (min-width: 2560px) {
    html {
      font-size: 15px;
    }
  }
`

@withTheme()
class TransactionPage extends Component {
  render() {
    const { theme } = this.props
    const color = theme.palette.secondary.main
    const login = true
    const isSideNavOpen = true
    const newKeys = [
      //TODO hardcode for test
      {
        _id: '5be06b72d125a67cc2ccc03c',
        name: 'test',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd96a13a01067001a8dbc93',
        name: 'corpacc',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd43d75cc816b001b5bd224',
        name: 'dontKnowKey',
        selected: true,
        __typename: 'entitySettings',
      },
    ]

    const activeKeys = [
      //TODO hardcode for test
      {
        _id: '5be06b72d125a67cc2ccc03c',
        name: 'test',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd96a13a01067001a8dbc93',
        name: 'corpacc',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd43d75cc816b001b5bd224',
        name: 'dontKnowKey',
        selected: true,
        __typename: 'entitySettings',
      },
    ]

    const activeWallets = [
      //TODO hardcode for test
      {
        _id: '5be06b72d125a67cc2ccc03c',
        name: 'test',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd96a13a01067001a8dbc93',
        name: 'corpacc',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd43d75cc816b001b5bd224',
        name: 'dontKnowKey',
        selected: true,
        __typename: 'entitySettings',
      },
    ]

    const newWallets = [
      //TODO hardcode for test
      {
        _id: '5be06b72d125a67cc2ccc03c',
        name: 'test',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd96a13a01067001a8dbc93',
        name: 'corpacc',
        selected: false,
        __typename: 'entitySettings',
      },
      {
        _id: '5cd43d75cc816b001b5bd224',
        name: 'dontKnowKey',
        selected: true,
        __typename: 'entitySettings',
      },
    ]
    const isCheckedAll =
      activeKeys.length + activeWallets.length ===
      newKeys.length + newWallets.length
    const isRebalance = false

    // TODO: Account block, less more pointers, table fonts, titles

    return (
      <>
      <TransactionPageMediaQuery/>
      <Grid
        container
        justify="space-between"
        style={{
          height: '90vh',
          padding: '30px 5% 30px 5px',
          overflow: 'hidden',
          flexWrap: 'nowrap'
        }}
        // borderColor={`1px solid ${theme.palette.grey[theme.palette.type]}`}
      >
        {/* Accounts */}
        <Grid item lg={2} md={2}>
          <GridAccountContainer
            borderColor={`1px solid ${theme.palette.grey[theme.palette.type]}`}
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
                <SvgIcon src={TransactionsAccountsBackground} style={{
                  position: 'absolute',
                  top: '-4rem',
                  left: 0
                }} width="100%" height="20rem"/>
                <TypographyAccountTitle>Portfolio</TypographyAccountTitle>
                <AccountsSlick/>
              </PortfolioSelectorWrapper>

              <Grid>
                <Accounts
                  {...{
                    color,
                    login,
                    isSideNavOpen,
                    isCheckedAll,
                    newKeys,
                    isRebalance,
                    onToggleAll: this.onToggleAll,
                    onKeyToggle: this.onKeyToggle,
                    onKeySelectOnlyOne: this.onKeySelectOnlyOne,
                  }}
                />
              </Grid>
            </ContentGrid>
            <GridShowHideDataContainer>
              <ShowHideData />
            </GridShowHideDataContainer>
          </GridAccountContainer>
        </Grid>

        <GridItemContainer
          item
          lg={8}
          md={8}
          style={{ boxShadow: 'none', border: 'none', paddingLeft: '1.5rem' }}
        >
          <Grid item style={{ height: '100%' }}>
            <ChoosePeriod/>
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
          </Grid>
        </GridItemContainer>

        <GridItemContainer
          item
          lg={2}
          md={2}
          style={{ boxShadow: 'none', border: 'none', paddingLeft: '1.5rem' }}
        >
          <TransactionsActionsStatistic/>
          <WinLossRatio/>
        </GridItemContainer>
      </Grid>
      </>
    )
  }
}

export default TransactionPage
