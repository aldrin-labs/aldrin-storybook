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
} from './TransactionPage.styles'

//TODO
// import LineChart from '@sb/components/LineChart'
// import Table from '@sb/components/Tables/index'
// import HeatMapChart from '@sb/components/HeatMapChart'
import Accounts from '@sb/components/Accounts/Accounts'
import PortfolioSelector from './PortfolioSelector/PortfolioSelector'
import ShowHideData from './ShowHideData/ShowHideData'
import { LineSeries, XYPlot } from 'react-vis'
import { withTheme } from '@material-ui/styles'

@withTheme()
class TransactionPage extends Component {
  render() {
    const mockLineData = [
      {
        x: 0,
        y: 10,
      },
      {
        x: 1,
        y: 9.711949294780151,
      },
      {
        x: 2,
        y: 9.435362988707922,
      },
      {
        x: 3,
        y: 8.567833354235509,
      },
      {
        x: 4,
        y: 8.952000250954315,
      },
      {
        x: 5,
        y: 9.100140301097348,
      },
      {
        x: 6,
        y: 9.527500935032938,
      },
      {
        x: 7,
        y: 8.879424566545511,
      },
      {
        x: 8,
        y: 9.37592745035338,
      },
      {
        x: 9,
        y: 9.404755572687424,
      },
      {
        x: 10,
        y: 9.09422755036006,
      },
      {
        x: 11,
        y: 8.988221921504515,
      },
      {
        x: 12,
        y: 8.902258916655752,
      },
      {
        x: 13,
        y: 8.35330837446755,
      },
      {
        x: 14,
        y: 8.774051054408813,
      },
      {
        x: 15,
        y: 9.386415319337225,
      },
      {
        x: 16,
        y: 9.750396957422925,
      },
      {
        x: 17,
        y: 9.570285976590263,
      },
      {
        x: 18,
        y: 9.573916410282573,
      },
      {
        x: 19,
        y: 9.93453830562116,
      },
      {
        x: 20,
        y: 9.435929834047807,
      },
    ]

    const mockHeatData = [
      {
        x: 1,
        y: 1,
        color: 'red',
      },
      {
        x: 2,
        y: 1,
        color: 'red',
      },
      {
        x: 2,
        y: 2,
        color: 'red',
      },
      {
        x: 3,
        y: 4,
        color: 'red',
      },
    ]

    const { children, Chart, PortfolioActions, theme } = this.props
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
        <GridItemContainer
          item
          lg={2}
          md={2}
          style={{ position: 'relative' }}
        >
          <GridContainerTitle content alignItems="center">
            <TypographyContatinerTitle>accounts</TypographyContatinerTitle>
          </GridContainerTitle>
          <ContentGrid style={{ marginTop: '25px' }}>
            <TypographyAccountTitle>Portfolio</TypographyAccountTitle>

            <PortfolioSelector />

            <TypographyTitle lineHeight={'22px'}>
              $500,000.00
            </TypographyTitle>

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
          <Grid
            style={{
              position: 'absolute',
              bottom: '0',
              minWidth: '180px',
              //paddingLeft: '15px',
            }}
          >
            <ShowHideData />
          </Grid>
        </GridItemContainer>

        {/* Calendar */}
        <GridItemContainer item lg={2} md={2}>
          {/* git  */}
          <GridContainerTitle content alignItems="center">
            <TypographyContatinerTitle>calendar</TypographyContatinerTitle>
          </GridContainerTitle>
          <Grid style={{ padding: '0 0 20px 0' }}>
            <Grid style={{ padding: '0 0 10px 45px' }}>
              <GitTransactionCalendar />
            </Grid>
            <Grid container justify="center" style={{ margineTop: '15px' }}>
              <Grid lg={2}>
                <Typography
                  style={{
                    padding: '0 10px',
                    textAlign: 'right',
                    fontSize: '0.5625rem',
                  }}
                >
                  Less
                </Typography>
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
                <Typography
                  style={{ padding: '0 10px', fontSize: '0.5625rem' }}
                >
                  More
                </Typography>
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
                <TypographyContatinerTitle textAlign={'left'} textPadding={'0 0 0 35px'}>
                  Transactions
                </TypographyContatinerTitle>
                <TypographyContatinerTitle>
                  Jan, 25 - feb, 8, 2019
                </TypographyContatinerTitle>
              </Grid>
            </GridContainerTitle>
            <Grid style={{ padding: '0 25px' }}>{PortfolioActions}</Grid>
          </GridItemContainer>

          <GridItemContainer
            item
            lg={12}
            md={12}
            style={{ height: '32%', marginTop: '2%' }}
          >
            {/* {children} */}
            {Chart}
            {/* <LineChart
            data={mockLineData} //: Serie[][] | undefined
            activeLine={1} //: number | null
            showCustomPlaceholder={false} //: boolean
            // placeholderElement={} //: any
            // onChangeData={} //?: Function
          /> */}
          </GridItemContainer>
        </GridItemContainer>
      </Grid>
    )
  }
}

export default TransactionPage
