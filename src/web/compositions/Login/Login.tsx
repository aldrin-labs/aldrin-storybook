import React from 'react'
import { Button, Grid } from '@material-ui/core'

import YouNotLoginedCard from '@sb/components/YouNotLoginedCard'
import Login from '@core/containers/Login'

export default ({}) => (
  <YouNotLoginedCard open={true}>
    <Grid container justify="center" alignItems="center">
      <Login />
    </Grid>
  </YouNotLoginedCard>
)
