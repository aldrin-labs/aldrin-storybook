import React from 'react'
import ProgressBar from './ProgressBar'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
} from './ProgressBar.styles'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: '#00695c',
  },
  linearColorPrimary: {
    backgroundColor: '#b2dfdb',
  }})

function ProgressBarWrapper(props) {
  const { data, classes } = props

  return data.map((datum) => {
    return (
      <Grid container style={{ marginBottom: '8px' }}>
        <GridFlex item lg={3} md={3} padding="0 0 0 20px">
          <TypographyCustom>{datum.label}</TypographyCustom>
        </GridFlex>

        <Grid
          item
          lg={6}
          md={6}
          style={{ background: '#E7ECF3', borderRadius: '35px' }}
        >
          <LinearProgressCustom
            // classes={{
            //   colorPrimary: classes.linearColorPrimary,
            //   barColorPrimary: classes.linearBarColorPrimary,
            // }}
            color={datum.color}
            height="20px"
            width={`${datum.percentage}%`}
            variant="determinate"
            value={20}
          />
        </Grid>

        <GridFlex item lg={3} md={3} justify="center">
          <TypographyCustom>{datum.percentage}%</TypographyCustom>
        </GridFlex>
      </Grid>
    )
  })
}

export default withStyles(styles)(ProgressBarWrapper)