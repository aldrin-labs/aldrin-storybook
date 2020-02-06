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
  processAuthentificationHandler,
}: {
  theme: Theme
  enterRecoveryCodeHandler: (recoveryCode: string) => void
  status: 'error' | 'success'
  errorMessage: string
  newRecoveryCode: string
  processAuthentificationHandler: () => void
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
        <Button
          disabled={newRecoveryCode}
          onClick={() => enterRecoveryCodeHandler(recoveryCode)}
        >
          Confirm
        </Button>
        {newRecoveryCode && (
          <Button onClick={() => processAuthentificationHandler()}>
            Go to App
          </Button>
        )}
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(EnterRecoveryCode)
