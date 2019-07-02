import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { TypographyCoinName, TableHeadFont } from './TableAccordion.styles'
import {Typography, Grid} from '@material-ui/core'

import Slider from '../Slider/Slider'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    border: 'none',
  },
  table: {
    //minWidth: 700,
  },
  bullet: {
    //width: '50px',
    '&:before':{
      content: "'\\2022'",
      color: 'red',
      fontWeight: 'bold',
      display: 'inline-block',
      width: '4px',
    }
  },
})

let id = 0
function createData(name, currentValue, targetValue) {
  id += 1
  return { id, name, currentValue, targetValue }
}

const rows = [
  createData('BTC', '$ 5,000.153', '$12,000.153'),
  createData('ETH', '$ 5,000.153', '$12,000.153'),
  createData('MFT', '$ 5,000.153', '$12,000.153'),
  createData('XRP', '$ 5,000.153', '$12,000.153'),
]

function TableAccordion(props) {
  const { classes } = props

  return (
    <Grid
      container
      lg={12}
      style={{
        padding: '10px 0',
        borderTop: '1px solid #E7ECF3',
        borderBottom: '1px solid #E7ECF3',
      }}
    >
      <Grid container lg={12}>
        <Grid item lg={3} style={{ padding: '0px' }}>
          <TableHeadFont align="left" style={{ textAlign: 'left' }}>
            COIN
          </TableHeadFont>
        </Grid>
        <Grid item lg={2} style={{ display: 'flex', paddingLeft: '30px' }}>
          <TableHeadFont style={{ textAlign: 'center' }}>
            CURRENT VALUES
          </TableHeadFont>
        </Grid>
        <Grid item lg={3} style={{ padding: '0px' }}>
          <TableHeadFont align="left" style={{ textAlign: 'center' }}>
            .
          </TableHeadFont>
        </Grid>
        <Grid item lg={4} style={{ display: 'flex', paddingLeft: '9%' }}>
          <TableHeadFont align="left" style={{ textAlign: 'center' }}>
            TARGET VALUES
          </TableHeadFont>
        </Grid>
        {/* <Grid item lg={1} md={3}>.</Grid> */}
      </Grid>


                {rows.map((row) => {
                  
                  
                  
                    return(
                      <Grid container lg={12} style={{paddingTop: '12px'}}>
                          <Grid item lg={3} style={{ padding: '0px' }}>
                          <TableHeadFont align="left" style={{ textAlign: 'left', color: '#7284A0', fontSize: '16px' }}>
                            {row.name}
                          </TableHeadFont>
                          </Grid>
                          <Grid item lg={2} style={{ display: 'flex', paddingLeft: '30px' }}>
                            <TableHeadFont style={{ textAlign: 'center', color: '#16253D', fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}>
                              {row.currentValue}
                            </TableHeadFont>
                          </Grid>
                          <Grid item lg={3} style={{ paddingLeft: '5%', display:'flex', alignItems: 'center' }}>
                              <Slider
                                thumbWidth="25px"
                                thumbHeight="25px"
                                sliderWidth="125px"
                                sliderHeight="17px"
                                sliderHeightAfter="20px"
                                borderRadius="30px"
                                borderRadiusAfter="30px"
                                thumbBackground="blue"
                                borderThumb="2px solid white"
                                trackAfterBackground="#E7ECF3"
                                trackBeforeBackground="#97C15C"
                                value={80} //{this.state.value}
                                //onChange={this.handleSlideChange}
                                style={{ marginLeft: '-20px' }}
                              />

                              <Typography style={{marginLeft: '20px', fontWeight: 'bold', fontSize: '16px'}}>80%</Typography>
                          </Grid>
                          <Grid item lg={4} style={{ display: 'flex', paddingLeft: '8%' }}>
                            <TableHeadFont align="left" style={{ textAlign: 'center', color: '#16253D', fontWeight: 'bold', fontSize: '16px', marginLeft: '15px' }}>
                              {row.targetValue}
                            </TableHeadFont>
                          </Grid>
                      </Grid> 
                    )


                  })
                }


    </Grid>
  )
}

export default withStyles(styles)(TableAccordion)
