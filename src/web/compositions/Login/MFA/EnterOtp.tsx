import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { compose } from 'recompose'
import { Grid, Typography, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'

import GoogleAuthenticationLogo from '@icons/googleAuthentication.svg'

const EnterOtp = ({
  theme,
  changeStep,
  status,
  errorMessage,
  otpCompleteHandler,
}: {
  theme: Theme
  changeStep: (step: string) => void
  otpCompleteHandler: (otp: string) => void
  status: 'error' | 'success'
  errorMessage: string
}) => {

  const [otp, setOtp] = useState('')

  const otpChangeHandler = (otp: string) => {
    setOtp(otp)

    if (otp.length === 6) {
      otpCompleteHandler(otp)
    }
  }

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
          value={otp}
          onChange={(otp: string) => otpChangeHandler(otp)}
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
