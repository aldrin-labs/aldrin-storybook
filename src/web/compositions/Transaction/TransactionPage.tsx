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
  TypographyCalendarLegend,
  LessMoreContainer,
  GridTableContainer,
  TransactionsTitle,
  CalendarGrid,
} from './TransactionPage.styles'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'

import Accounts from '@sb/components/Accounts/Accounts'
import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import ShowHideData from './ShowHideData/ShowHideData'
import { withTheme } from '@material-ui/styles'

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
              <TypographyAccountTitle>Portfolio</TypographyAccountTitle>

              <PortfolioSelector />

              <TypographyTitle lineHeight={'22px'}>$500,000.00</TypographyTitle>

              <Grid style={{ marginTop: '25px' }}>
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

        {/* Calendar */}
        <Grid item lg={2} md={2} style={{ marginLeft: '1.5rem' }}>
          <GridItemContainer
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
                calendar
              </TypographyContatinerTitle>
            </GridContainerTitle>
            <Grid style={{ padding: '0 0 20px 0' }}>
              <Grid style={{ padding: '0 0 10px 45px' }}>
                <GitTransactionCalendar />
              </Grid>
              <Grid container justify="center" style={{ margineTop: '15px' }}>
                <Grid lg={2}>
                  <TypographyCalendarLegend textAlign={'right'}>
                    Less
                  </TypographyCalendarLegend>
                </Grid>

                <Grid container justify="center" lg={8}>
                  <LessMoreContainer />
                </Grid>
                <Grid lg={2}>
                  <TypographyCalendarLegend>More</TypographyCalendarLegend>
                </Grid>
              </Grid>
            </Grid>
          </GridItemContainer>
        </Grid>

        <GridItemContainer
          item
          lg={8}
          md={8}
          style={{ boxShadow: 'none', border: 'none', paddingLeft: '1.5rem' }}
        >
          <Grid item style={{ height: '100%' }}>
            <GridTableContainer
              item
              lg={12}
              md={12}
              borderColor={`1px solid ${
                theme.palette.grey[theme.palette.type]
              }`}
            >
              {/* <Table tableStyles={tableStyles} /> */}
              <GridContainerTitle
                content
                alignItems="center"
                bgColor={theme.palette.primary.dark}
              >
                <Grid
                  style={{
                    display: 'flex',
                    width: '70%',
                    justifyContent: 'space-between',
                    padding: '.25rem 1.5rem .5rem'
                  }}
                >
                  <TransactionsTitle textAlign={'left'} textColor={theme.palette.text.subPrimary}>
                    Transactions
                  </TransactionsTitle>
                  <TypographyContatinerTitle textColor={theme.palette.text.subPrimary}>
                    Jan, 25 - feb, 8, 2019
                  </TypographyContatinerTitle>
                </Grid>
              </GridContainerTitle>
              <Grid>
                <TradeOrderHistory style={{ overflow: 'scroll' }} />
              </Grid>
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
      </Grid>
      </>
    )
  }
}

export default TransactionPage
