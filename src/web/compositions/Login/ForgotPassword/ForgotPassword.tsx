import React, { ChangeEvent, useState } from 'react'
import { compose } from 'recompose'
import {
  Grid,
  Typography,
  Theme,
  Input,
  Button,
} from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

const ForgotPassoword = ({
  theme,
  onForgotPasswordClick,
  status,
  errorMessage,
}: {
  theme: Theme
  // TODO: Need to replace any here
  onForgotPasswordClick: ({
    email,
  }: {
    email: string
  }) => any
  status: 'error' | 'success'
  errorMessage: string
}) => {
  const [email, setEmail] = useState('')

  return (
    <Grid>
      <Grid>
        <Typography>Forgot your password?</Typography>
      </Grid>
      <Grid>
        <Typography>
          Enter the e-mail address to which your account is registered. We will
          send you a link to reset your password.
        </Typography>
      </Grid>
      <Grid>
        <Input
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Grid>
      <Grid>
        {status === 'error' && errorMessage !== '' && (
          <Typography>{errorMessage}</Typography>
        )}
        {status === 'success' && errorMessage === '' && (
          <Typography>
            We've just sent you an email to reset your password
          </Typography>
        )}
      </Grid>
      <Grid>
        <Button onClick={() => onForgotPasswordClick({ email })}>
          Confirm and go to the mailbox
        </Button>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(ForgotPassoword)
