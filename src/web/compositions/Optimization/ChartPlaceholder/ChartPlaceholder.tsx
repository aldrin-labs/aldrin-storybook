import React from 'react'
import { Typography } from '@material-ui/core'

import { CentredContainer } from '@sb/styles/cssUtils'

export const ChartPlaceholder = () => (
  <CentredContainer>
    <Typography variant={'h2'} align={'center'} gutterBottom={true}>
      N/A
    </Typography>
    <Typography variant={'h2'} align={'center'}>
      Run Optimization
    </Typography>
  </CentredContainer>
)

