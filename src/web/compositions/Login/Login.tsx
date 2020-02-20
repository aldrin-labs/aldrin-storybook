import React from 'react'
import { Grid } from '@material-ui/core'

import LoginCustom from '@core/containers/LoginCustom'

export default ({ initialStep }: { initialStep: 'signIn' | 'signUp' }) => (
  <Grid
    style={{ height: 'calc(100% - 5rem)' }}
    container
    justify="center"
    alignItems="center"
  >
    <LoginCustom initialStep={initialStep} />
  </Grid>
)
