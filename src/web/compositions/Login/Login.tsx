import React from 'react'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

import LoginCustom from '@core/containers/LoginCustom'

const Login = ({
  initialStep,
  ...props
}: {
  initialStep: 'signIn' | 'signUp'
}) => (
  <Grid
    style={{ height: 'calc(100% - 5.4vh)' }}
    container
    justify="center"
    alignItems="center"
  >
    <LoginCustom initialStep={initialStep} {...props} />
  </Grid>
)

export default withRouter(Login)
