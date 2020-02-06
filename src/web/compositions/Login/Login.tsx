import React from 'react'
import { Button, Grid } from '@material-ui/core'

import YouNotLoginedCard from '@sb/components/YouNotLoginedCard'
// import Login from '@core/containers/Login'
import Login from './LoginComposition'

export default ({}) => (
  <Grid container justify="center" alignItems="center">
    <Login />
  </Grid>
)
