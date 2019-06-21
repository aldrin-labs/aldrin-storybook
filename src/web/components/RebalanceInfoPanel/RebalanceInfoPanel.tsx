import React, { Component } from 'react'
import { Grid  } from '@material-ui/core'
import { StyledTypography, StyledSubTypography, StyledRebalanceInfoBtn, CustomLink } from './RebalanceInfoPanel.styles'




export default class RebalanceInfoPanel extends Component {
  render() {
    return (
      <Grid container style={{height: '100px', background: ''}}>
        {/* Grid - 1st item md - 6 Starts */}
        <Grid item md={5}>
          <Grid container style={{height: '100px', background: ''}}>
            <Grid container justify="space-between" style={{height: '100px', background: ''}}>

              <Grid item lg={4} justify="center">
                  <StyledTypography>Binance trade account</StyledTypography>
                  <StyledSubTypography variant={'h6'} prymaryColor="#ffffff">$138, 000.50</StyledSubTypography>
              </Grid>
              
              <Grid item lg={4} >
                  <StyledTypography>Binance trade account</StyledTypography>
                  <StyledSubTypography variant={'h6'} secondaryColor="#97C15C">$70, 500.00</StyledSubTypography>
              </Grid>
              
              <Grid item lg={4} >
                  <StyledTypography>Available percentage</StyledTypography>
                  <StyledSubTypography variant={'h6'} secondaryColor="#97C15C">75%</StyledSubTypography>
              </Grid>

            </Grid>{/* Grid - container justify center end*/}
          </Grid>{/* Grid - container end*/}
        </Grid> {/* Grid - 1st item md = 6 end */}

        <Grid item md={2}></Grid>
          {/* Space */}

        {/* Grid - 2nd item md - 6 Starts */}
        <Grid item md={5}>
          <Grid container>
            <Grid container justify="center">

              <Grid item lg={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <StyledRebalanceInfoBtn>coin chart</StyledRebalanceInfoBtn>
              </Grid>

              <Grid item lg={4}  style={{display: 'flex', justifyContent: 'center'}}>
                <CustomLink href={'#'} position="center" verticalPosition="center">rebalance </CustomLink>
                <CustomLink href={'#'} position="center" verticalPosition="center" linkColor="#5085EC">weekly </CustomLink>
              
              
              
              




               {/*
               <form className={classes.root} autoComplete="off">
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="age-simple">Age</InputLabel>
                      <Select
                        value={this.state.age}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'age',
                          id: 'age-simple',
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl> 
                  </form>
                */}





              
              
              
              
              </Grid>

              <Grid item lg={4}>
                  <StyledTypography position="right">Next Rebalance in</StyledTypography>  
                  <StyledSubTypography variant={'h5'} counterColor="#ED6337" position="right">55:36:48</StyledSubTypography> 
              </Grid>

            </Grid>{/* Grid - container justify center end*/}
          </Grid>{/* Grid - container end*/}
        </Grid> {/* Grid - 2nd item md = 6 end */}

      </Grid> 
      // Grid - main container
    )
  }
}