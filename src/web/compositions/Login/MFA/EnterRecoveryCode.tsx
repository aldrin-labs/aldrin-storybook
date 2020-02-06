import React, { useState, ChangeEvent } from 'react'
import { compose } from 'recompose'
import { Grid, Typography, Theme, Input, Button } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'

import GoogleAuthenticationLogo from '@icons/googleAuthentication.svg'

const EnterRecoveryCode = ({
  theme,
  enterRecoveryCodeHandler,
  status,
  errorMessage,
  newRecoveryCode,
}: {
  theme: Theme
  enterRecoveryCodeHandler: (recoveryCode: string) => void
  status: 'error' | 'success'
  errorMessage: string
  newRecoveryCode: string
}) => {
  const [recoveryCode, setRecoveryCode] = useState('')

  return (
    <Grid>
      <Grid>
        <Typography>Google Authentication</Typography>
      </Grid>
      <Grid>
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <Typography>Input your 2FA recovery code here:</Typography>
      </Grid>
      <Grid>
        <Input
          value={recoveryCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRecoveryCode(e.target.value)
          }
        />
        {status === 'error' && errorMessage !== '' && (
          <Typography>{errorMessage}</Typography>
        )}
      </Grid>
      {status === 'success' && errorMessage === '' && (
        <Grid>
          <Typography>New recovery code:</Typography>
          <Typography>{newRecoveryCode}</Typography>
        </Grid>
      )}
      <Grid>
        <Button onClick={() => enterRecoveryCodeHandler(recoveryCode)}>
          I already have the app
        </Button>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(EnterRecoveryCode)
