import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  GridInfoPanelWrapper,
  StyledTypography,
  StyledSubTypography,
  TypographyRebalance,
  ReactSelectCustom,
} from './RebalanceInfoPanel.styles'
import { withTheme } from '@material-ui/styles'
import Timer from 'react-compound-timer'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import SelectElement from './SelectElement'
import { IProps } from './RebalanceInfoPanel.types'

import SingleSelect from '../Select/SingleSelect'

import Input from '@material-ui/core/Input'

@withTheme()
export default class RebalanceInfoPanel extends Component<IProps> {
  state = {
    isHiddenRebalanceDaysInput: 'hidden',
  }

  slicePrice = (availableValue) => {
    let result = ''
    !availableValue.indexOf('-')
      ? (result = `0`)
      : availableValue !== '0'
      ? (result = availableValue.substring(0, availableValue.indexOf('.')))
      : (result = availableValue)
    return result
  }


  render() {
    let {
      rebalanceInfoPanelData: {
        accountValue,
        availableValue,
        availablePercentage,
        rebalanceTime,
      },
      rebalanceOption,
      toggleSectionCoinChart,
      isSectionChart,
      theme: {
        palette: { blue, red, green, grey },
      },
    } = this.props

    return (
      <GridInfoPanelWrapper container justify="space-between">
        {/* Grid - 1st item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">
              <Grid item lg={4} md={3} justify="center">
                <StyledTypography fontWeight={'700'}>
                  Binance trade account
                </StyledTypography>
                <StyledSubTypography fontWeight={'700'} color={blue.light}>
                  ${accountValue.substring(0, accountValue.indexOf('.'))}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={3} md={4} style={{ paddingRight: '17px' }}>
                <StyledTypography fontWeight={'700'} position="right">
                  aviable value
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'700'}
                  color={green.custom}
                  position="right"
                >
                  ${' '}
                  {availableValue != '0'
                    ? this.slicePrice(availableValue)
                    : `0`}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={4} md={4}>
                <StyledTypography fontWeight={'700'} position="right">
                  Available percentage
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'700'}
                  color={green.custom}
                  position="right"
                >
                  {this.slicePrice(availablePercentage)}%
                </StyledSubTypography>
              </Grid>
            </Grid>
            {/* Grid - container justify center end*/}
          </Grid>
          {/* Grid - container end*/}
        </Grid>{' '}
        {/* Grid - 1st item md = 6 end */}
        {/* <Grid item md={0} lg={2}></Grid>
          Space */}
        {/* Grid - 2nd item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">
              <GridFlex
                justify="flex-start"
                alignItems="center"
                item
                lg={3}
              >
                <BtnCustom
                  borderRadius={'10px'}
                  btnColor={blue.custom}
                  btnWidth="118px"
                  height="24px"
                  onClick={toggleSectionCoinChart}
                >
                  {isSectionChart ? `section chart` : `coin chart`}
                </BtnCustom>
              </GridFlex>

              {/* TODO: Grid item doesn't react on justify="center" aand alignItems */}
              <GridFlex
                item
                lg={6}
                justify="center"
                alignItems="center"
                style={{ paddingRight: '17px' }}
              >
                <TypographyRebalance href={'#'} linkColor={grey.dark}>
                  rebalance{' '}
                </TypographyRebalance>

                <StyledTypography
                  style={{
                    visibility: this.state.isHiddenRebalanceDaysInput,
                  }}
                >
                  Every{' '}
                </StyledTypography>

                {/* <SelectElement
                  rebalanceOption={rebalanceOption}
                  setRebalanceTimer={this.setRebalanceTimer}
                /> */}

                {/* <SingleSelect /> */}

                <ReactSelectCustom
                  options={[
                    {
                      value: 'daily',
                      label: 'daily',
                      color: '#165BE0',
                      isFixed: true,
                    },
                    { value: 'weekly', label: 'Weekly', color: '#165BE0' },
                    {
                      value: 'bi-weekly',
                      label: 'Bi-Weekly',
                      color: '#165BE0',
                    },
                    {
                      value: 'monthly',
                      label: 'Monthly',
                      color: '#165BE0',
                    },
                    // { value: 'Checkbox', label: <Checkbox/>, color: '#D93B28' },
                    {
                      value: 'stop-rebalance',
                      label: 'Stop Rebalance',
                      color: '#D93B28',
                    },
                  ]}
                  singleValueStyles={{
                    color: '#165BE0',
                    fontSize: '11px',
                    padding: '0',
                  }}
                  indicatorSeparator={{
                    color: 'orange',
                    background: 'transparent',
                  }}
                  control={{
                    background: 'transparent',
                    border: 'none',
                    width: 100,
                    // border: state.isFocused ? 0 : 0,
                    // boxShadow: state.isFocused ? 0 : 0,
                    // '&:hover': {
                    //   border: state.isFocused ? 0 : 0,
                    // },
                  }}
                  menu={{
                    width: 120,
                    padding: '5px 8px',
                    borderRadius: '14px',
                  }}
                  container={{
                    background: 'transparent',
                    padding: 0,
                    color: '#165BE0',
                    '&:focus': {
                      border: '0 solid transparent',
                      borderColor: 'transparent',
                      boxShadow: '0 0 0 1px transparent',
                    },
                  }}
                />

                <Input
                  placeholder="days"
                  style={{
                    visibility: this.state.isHiddenRebalanceDaysInput,
                  }}
                />
              </GridFlex>

              <Grid item lg={3}>
                <StyledTypography fontWeight={'700'} position="right">
                  Next Rebalance in
                </StyledTypography>
                <StyledSubTypography
                  color={red.bright}
                  fontWeight={'700'}
                  position="right"
                >
                  <Timer
                    initialTime={rebalanceTime}
                    direction="backward"
                    startImmediately={true}
                  >
                    {() => (
                      <React.Fragment>
                        <Timer.Hours />:
                        <Timer.Minutes />:
                        <Timer.Seconds />
                      </React.Fragment>
                    )}
                  </Timer>
                </StyledSubTypography>
              </Grid>
            </Grid>
            {/* Grid - container justify center end*/}
          </Grid>
          {/* Grid - container end*/}
        </Grid>{' '}
        {/* Grid - 2nd item md = 6 end */}
      </GridInfoPanelWrapper>
      // Grid - main container
    )
  }
}
