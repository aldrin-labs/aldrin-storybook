import React, { Component } from 'react'
import GitTransactionCalendar from '@sb/components/GitTransactionCalendar'

import Accounts from '@sb/components/Accounts/Accounts'
import LineChart from '@sb/components/LineChart'
import Table from '@sb/components/Tables/index'
import HeatMapChart from '@sb/components/HeatMapChart'

import { Grid, Typography } from '@material-ui/core'
import {
  GridProgressTitle,
  TypographyContatinerTitle,
  GridItemContainer,
  TypographyAccountTitle,
  ContentGrid,
  ReactSelectCustom,
} from './TransactionPage.styles'

//TODO
import ShowHideData from './ShowHideData/ShowHideData'
import { LineSeries, XYPlot } from 'react-vis'

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

    const tableStyles = {
      heading: {},
      title: {},
      cell: {},
    }

    const { children, Chart, PortfolioActions } = this.props
    return (
      <Grid container justify="space-between">
        {/* Accounts */}
        <GridItemContainer item lg={2} md={2}>
          <GridProgressTitle content alignItems="center">
            <TypographyContatinerTitle>accounts</TypographyContatinerTitle>
          </GridProgressTitle>
          <ContentGrid>
            <TypographyAccountTitle>Portfolio</TypographyAccountTitle>
            <ReactSelectCustom
              value={'MyPortfoliosOptions[0]'}
              // onChange={(
              //   optionSelected: {
              //     label: string
              //     value: string
              //   } | null
              // ) => onRebalanceTimerChange(optionSelected)}
              isSearchable={false}
              options={['MyPortfoliosOptions', 'MyPortfoliosOptions']}
              singleValueStyles={{
                color: '#165BE0',
                fontSize: '11px',
                padding: '0',
              }}
              indicatorSeparatorStyles={{}}
              controlStyles={{
                background: 'transparent',
                border: 'none',
                width: 200,
              }}
              menuStyles={{
                width: 235,
                padding: '5px 8px',
                borderRadius: '14px',
                textAlign: 'center',
              }}
              optionStyles={{
                color: '#7284A0',
                background: 'transparent',
                textAlign: 'center',
                fontSize: '0.62rem',
                '&:hover': {
                  borderRadius: '14px',
                  color: '#16253D',
                  background: '#E7ECF3',
                },
              }}
            />

            {/* <Grid>
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
            </Grid> */}

            <ShowHideData />
          </ContentGrid>
        </GridItemContainer>

        {/* Calendar */}
        <GridItemContainer item lg={2} md={2}>
          {/* git  */}
          <GridProgressTitle content alignItems="center">
            <TypographyContatinerTitle>calendar</TypographyContatinerTitle>
          </GridProgressTitle>
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

        <GridItemContainer item lg={7} md={7} >
          <GridItemContainer item lg={12} md={12}> 
            {/* <Table tableStyles={tableStyles} /> */}
            {PortfolioActions}
            {/* <HeatMapChart data={mockHeatData} width={10} height={10} /> */}
          </GridItemContainer>

          <GridItemContainer item lg={12} md={12}>
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
