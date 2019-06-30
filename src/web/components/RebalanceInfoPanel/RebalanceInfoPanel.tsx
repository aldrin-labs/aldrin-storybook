import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  GridInfoPanelWrapper,
  StyledTypography,
  StyledSubTypography,
  CustomLink,
} from './RebalanceInfoPanel.styles'
import { withTheme } from '@material-ui/styles'
import Timer from 'react-compound-timer'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import SelectElement from './SelectElement'
import { IProps } from './RebalanceInfoPanel.types'

@withTheme()
export default class RebalanceInfoPanel extends Component<IProps> {
  setRebalanceTimer = () => {
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^')
    // if (event.target.value === 'Daily') {
    //   return (rebalanceTime = '0')
    // }

    // if (event.target.value === 'Weekly') {
    //   return (rebalanceTime = '0')
    // }

    // if (event.target.value === 'Monthly') {
    //   return (rebalanceTime = '0')
    // }
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
              <Grid item lg={4} justify="center">
                <StyledTypography fontWeight={'bold'}>
                  Binance trade account
                </StyledTypography>
                <StyledSubTypography fontWeight={'bold'} color={blue.light}>
                  ${accountValue}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={3}>
                <StyledTypography fontWeight={'bold'} position="right">
                  aviable value
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'bold'}
                  color={green.custom}
                  position="right"
                >
                  ${availableValue}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={4}>
                <StyledTypography fontWeight={'bold'} position="right">
                  Available percentage
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'bold'}
                  color={green.custom}
                  position="right"
                >
                  {availablePercentage}%
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
              <GridFlex alignItems="center" item lg={3}>
                <BtnCustom
                  borderRadius={'10px'}
                  btnColor={blue.custom}
                  btnWidth="100px"
                >
                  coin chart
                </BtnCustom>
              </GridFlex>

              {/* TODO: Grid item doesn't react on justify="center" aand alignItems */}
              <GridFlex item lg={6} justify="flex-end" alignItems="center">
                <CustomLink href={'#'} linkColor={grey.dark}>
                  rebalance{' '}
                </CustomLink>
                <SelectElement
                  rebalanceOption={rebalanceOption}
                  setRebalanceTimer={this.setRebalanceTimer}
                />
              </GridFlex>

              <Grid item lg={3}>
                <StyledTypography fontWeight={'bold'} position="right">
                  Next Rebalance in
                </StyledTypography>
                <StyledSubTypography
                  color={red.bright}
                  fontWeight={'bold'}
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
