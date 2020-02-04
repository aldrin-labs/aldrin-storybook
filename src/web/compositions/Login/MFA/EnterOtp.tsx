import React from 'react'
import OtpInput from 'react-otp-input'
import { compose } from 'recompose'
import { Grid, Typography, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'

import GoogleAuthenticationLogo from '@icons/googleAuthentication.svg'

const EnterOtp = ({
  theme,
  changeStep,
  onChangeOtp,
  status,
  errorMessage,
}: {
  theme: Theme
  changeStep: (step: string) => void
  onChangeOtp: (otp: string) => void
  status: 'error' | 'success'
  errorMessage: string
}) => {
  return (
    <Grid>
      <Grid>
        <Typography>Google Authentication</Typography>
      </Grid>
      <Grid>
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <Typography>
          Input the 6-digit code in your Google Authenticator app
        </Typography>
      </Grid>
      <Grid>
        <OtpInput
          onChange={(otp: string) => onChangeOtp(otp)}
          numInputs={6}
          separator={<span>-</span>}
        />
        {status === 'error' && errorMessage !== '' && (
          <Typography>
            {errorMessage}
          </Typography>
        )}
      </Grid>
      <Grid>
        <Typography onClick={() => changeStep('recoveryCode')}>
          Can't access Google Authenticator?
        </Typography>
      </Grid>
    </Grid>
  )
}

export default compose(withTheme)(EnterOtp)
