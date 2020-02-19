import React from 'react'
import { Grid } from '@material-ui/core'

import YouNotLoginedCard from '@sb/components/YouNotLoginedCard'
import LoginOld from '@core/containers/Login'
import LoginCustom from '@core/containers/LoginCustom'

export default ({ initialStep }: { initialStep?: 'signIn' | 'signUp' }) =>
  initialStep ? (
    <Grid
      style={{ height: 'calc(100% - 5rem)' }}
      container
      justify="center"
      alignItems="center"
    >
      <LoginCustom initialStep={initialStep} />
    </Grid>
  ) : (
    <YouNotLoginedCard open={true}>
      <Grid container justify="center" alignItems="center">
        <LoginOld />
      </Grid>
    </YouNotLoginedCard>
  )
