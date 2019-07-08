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

import SingleSelect from '../Select/SingleSelect'

@withTheme()
export default class RebalanceInfoPanel extends Component<IProps> {
  setRebalanceTimer = () => {
    console.log('TODO: set timer')
  }

  slicePrice = (availableValue) => {
    let result = ''
    !availableValue.indexOf('-')
      ? result =`0`
      : availableValue !== '0'
      ? (result = availableValue.substring(0, availableValue.indexOf('.')))
      : (result = availableValue)
      return result;
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
    
    console.log('availableValue: ', typeof(availableValue))
    return (
      <GridInfoPanelWrapper container justify="space-between">
        {/* Grid - 1st item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">
              <Grid item lg={4} md={3} justify="center">
                <StyledTypography fontWeight={'bold'}>
                  Binance trade account
                </StyledTypography>
                <StyledSubTypography fontWeight={'bold'} color={blue.light}>
                  ${accountValue.substring(0, accountValue.indexOf('.'))}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={3} md={4} style={{ paddingRight: '17px' }}>
                <StyledTypography fontWeight={'bold'} position="right">
                  aviable value
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'bold'}
                  color={green.custom}
                  position="right"
                >
                  ${' '}
                  {availableValue != '0'
                    ? this.slicePrice(availableValue)
                    : `0`}
                  {/* {!availableValue.indexOf('-')
                    ? `0`
                    : availableValue !== '0'
                    ? availableValue.substring(0, availableValue.indexOf('.'))
                    : availableValue} */}
                </StyledSubTypography>
              </Grid>

              <Grid item lg={4} md={4}>
                <StyledTypography fontWeight={'bold'} position="right">
                  Available percentage
                </StyledTypography>
                <StyledSubTypography
                  fontWeight={'bold'}
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
                  btnWidth="100px"
                >
                  coin chart
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
                <CustomLink href={'#'} linkColor={grey.dark}>
                  rebalance{' '}
                </CustomLink>
                
                {/* <SelectElement
                  rebalanceOption={rebalanceOption}
                  setRebalanceTimer={this.setRebalanceTimer}
                /> */}
                <SingleSelect />
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
