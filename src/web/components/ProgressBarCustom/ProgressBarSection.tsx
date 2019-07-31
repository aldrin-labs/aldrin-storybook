import React from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  LinearProgressCustom,
  TypographyCustom,
} from './ProgressBar.styles'

export default function ProgressBarSection(props) {
  const { datum } = props
  return (
    <Grid container style={{ marginBottom: '1.5vh' }}>
      <GridFlex item lg={3} md={3} padding="0">
        <TypographyCustom style={{ marginLeft: '12px' }}>
          {datum.label}
        </TypographyCustom>
      </GridFlex>
      <Grid
        item
        lg={6}
        md={6}
        style={{
          background: '#E7ECF3',
          borderRadius: '35px',
        }}
      >
        <LinearProgressCustom
          color={datum.color}
          width={`${datum.percentage}%`}
          variant="determinate"
          value={0}
        />
      </Grid>
      <GridFlex item lg={3} md={3} style={{ paddingLeft: '43px', justifyContent: 'center' }}>
        <TypographyCustom>{datum.percentage}%</TypographyCustom>
      </GridFlex>
    </Grid>
  )
}
