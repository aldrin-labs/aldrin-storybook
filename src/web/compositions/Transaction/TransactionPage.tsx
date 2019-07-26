import React, { Component } from 'react'
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
} from './TransactionPage.styles'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'

import Accounts from '@sb/components/Accounts/Accounts'
import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import ShowHideData from './ShowHideData/ShowHideData'
import { withTheme } from '@material-ui/styles'

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
    return (
      <Grid container justify="space-between">
        {/* Accounts */}
        <GridAccountContainer item lg={2} md={2}>
          <GridContainerTitle content alignItems="center">
            <TypographyContatinerTitle>accounts</TypographyContatinerTitle>
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

        {/* Calendar */}
        <GridItemContainer item lg={2} md={2}>
          <GridContainerTitle content alignItems="center">
            <TypographyContatinerTitle>calendar</TypographyContatinerTitle>
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

              <Grid lg={8}>
                <Grid
                  style={{
                    marginTop: '5px',
                    backgroundImage:
                      'linear-gradient(90deg, #E7ECF3 0%, #165BE0 100%)',
                    height: '12px',
                    width: '100%',
                    borderRadius: '32px',
                  }}
                />
              </Grid>
              <Grid lg={2}>
                <TypographyCalendarLegend>More</TypographyCalendarLegend>
              </Grid>
            </Grid>
          </Grid>
        </GridItemContainer>

        <GridItemContainer
          item
          lg={7}
          md={7}
          style={{ boxShadow: 'none', border: 'none' }}
        >
          <GridItemContainer item lg={12} md={12}>
            {/* <Table tableStyles={tableStyles} /> */}
            <GridContainerTitle content alignItems="center">
              <Grid
                style={{
                  display: 'flex',
                  width: '70%',
                  justifyContent: 'space-between',
                }}
              >
                <TypographyContatinerTitle
                  textAlign={'left'}
                  textPadding={'0 0 0 35px'}
                >
                  Transactions
                </TypographyContatinerTitle>
                <TypographyContatinerTitle>
                  Jan, 25 - feb, 8, 2019
                </TypographyContatinerTitle>
              </Grid>
            </GridContainerTitle>
            <Grid style={{ padding: '0 25px' }}>
              <TradeOrderHistory />
            </Grid>
          </GridItemContainer>

          <GridItemContainer
            item
            lg={12}
            md={12}
            style={{ height: '32%', marginTop: '2%' }}
          >
            <PortfolioMainChart
              title="Portfolio Value | Coming Soon | In development"
              style={{
                marginLeft: 0,
              }}
              marginTopHr="10px"
            />
          </GridItemContainer>
        </GridItemContainer>
      </Grid>
    )
  }
}

export default TransactionPage
