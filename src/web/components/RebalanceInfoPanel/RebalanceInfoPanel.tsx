import React, { Component } from 'react'
import { Grid  } from '@material-ui/core'
import { StyledTypography, StyledSubTypography, CustomLink } from './RebalanceInfoPanel.styles'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import SelectElement from './SelectElement'
import {IProps} from './RebalanceInfoPanel.types'
import { withTheme } from '@material-ui/styles'


@withTheme()

export default class RebalanceInfoPanel extends Component<IProps> {
  render() {
    const  {
      rebalanceInfoPanelData, 
      rebalanceOption, 
      theme: {palette: {blue, red, green}},
    } = this.props;
    const { firstColValue, secondColValue, thirdColValue, fourthColValue } = rebalanceInfoPanelData;

    return (
      <Grid container justify="space-between">
        {/* Grid - 1st item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">

              <Grid item lg={4} justify="center">
                  <StyledTypography>Binance trade account</StyledTypography>
                  <StyledSubTypography variant={'h6'} fontSize={'20px'} fontWeight={'600'} color={blue.light}>{firstColValue}</StyledSubTypography>
              </Grid>
              
              <Grid item lg={4} >
                  <StyledTypography position="right">Binance trade account</StyledTypography>
                  <StyledSubTypography variant={'h6'} fontSize={'20px'} fontWeight={'600'} color={green.custom} position="right">{secondColValue}</StyledSubTypography>
              </Grid>
              
              <Grid item lg={4} >
                  <StyledTypography position="right">Available percentage</StyledTypography>
                  <StyledSubTypography variant={'h6'} fontSize={'20px'} fontWeight={'600'} color={green.custom} position="right">{thirdColValue}</StyledSubTypography>
              </Grid>

            </Grid>{/* Grid - container justify center end*/}
          </Grid>{/* Grid - container end*/}
        </Grid> {/* Grid - 1st item md = 6 end */}

        {/* <Grid item md={0} lg={2}></Grid>
          Space */}

        {/* Grid - 2nd item md - 6 Starts */}
        <Grid item md={5} lg={5}>
          <Grid container>
            <Grid container justify="space-between">

              <Grid item lg={3}>
                <BtnCustom btnColor="#5085EC" btnWidth="100px">coin chart</BtnCustom>
              </Grid>

              {/* TODO: Grid item doesn't react on justify="center" aand alignItems */}
              <Grid item lg={6} style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                {/* style={{display: 'flex', justifyContent: '',alignItems: 'center'}} */}
                {/* verticalPosition="" */}
                <CustomLink href={'#'} linkColor={'#7284A0'}>rebalance </CustomLink>
                <SelectElement rebalanceOption={rebalanceOption}/>
              </Grid>

              <Grid item lg={3}>
                  <StyledTypography position="right">Next Rebalance in</StyledTypography>  
                  <StyledSubTypography variant={'h5'} counterColor="#ED6337" position="right">{fourthColValue}</StyledSubTypography> 
              </Grid>

            </Grid>{/* Grid - container justify center end*/}
          </Grid>{/* Grid - container end*/}
        </Grid> {/* Grid - 2nd item md = 6 end */}

      </Grid> 
      // Grid - main container
    )
  }
}