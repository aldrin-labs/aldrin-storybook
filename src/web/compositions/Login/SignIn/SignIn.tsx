import React, { ChangeEvent, useState } from 'react'
import { compose } from 'recompose'
import {
  Grid,
  Typography,
  Theme,
  Input,
  Button,
  Checkbox,
} from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'
import GoogleLogo from '@icons/googleLogo.svg'

const SignIn = ({
  theme,
  onLoginWithGoogleClick,
  onLoginButtonClick,
  changeStep,
  status,
  errorMessage,
}: {
  theme: Theme
  // TODO: Need to replace any here
  onLoginWithGoogleClick: () => any
  // TODO: Need to replace any here
  onLoginButtonClick: ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => any
  changeStep: (step: string) => void
  status: 'error' | 'success'
  errorMessage: string
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Grid>
      <Grid>
        <Button onClick={() => onLoginWithGoogleClick()}>
          Log in with Google
        </Button>
      </Grid>
      <Grid>
        <Typography>or</Typography>
      </Grid>
      <Grid>
        <Input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Grid>
      <Grid>
        <Input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </Grid>
      <Grid>
        {status === 'error' && errorMessage !== '' && (
          <Typography>{errorMessage}</Typography>
        )}
      </Grid>
      <Grid>
        <Grid>
          <Checkbox />
          <Typography>Remember me</Typography>
        </Grid>
        <Grid>
          <Typography onClick={() => changeStep('forgotPassword')}> Forgot password </Typography>
        </Grid>
      </Grid>
      <Grid>
        <Button onClick={() => onLoginButtonClick({ username: email, password })}>
          Log in
        </Button>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(SignIn)
