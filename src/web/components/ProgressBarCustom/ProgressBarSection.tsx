import React from 'react'
import { Grid } from '@material-ui/core'
import {
  GridFlex,
  TypographyCustom,
} from './ProgressBar.styles'

import { LinearProgressCustom, GridProgressBarContainer } from '@sb/styles/cssUtils'

export default function ProgressBarSection(props) {
  const { datum } = props
  return (
    <Grid container style={{ marginBottom: '.75rem' }}>
      <GridFlex item lg={3} md={3} padding="0">
        <TypographyCustom style={{ marginLeft: '12px' }}>
          {datum.label}
        </TypographyCustom>
      </GridFlex>
      <GridProgressBarContainer
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
      </GridProgressBarContainer>
      <GridFlex item lg={3} md={3} style={{ paddingLeft: '43px', justifyContent: 'center' }}>
        <TypographyCustom style={{ width: '3.6rem', textAlign: 'right' }}>{datum.percentage}%</TypographyCustom>
      </GridFlex>
    </Grid>
  )
}
