import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { compose } from 'recompose'
import { Grid, Typography, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'

import GoogleAuthenticationLogo from '@icons/googleAuthentication.svg'

import {
  SubmitLoginButton,
  StyledInputLogin,
  LoginContainer,
  LoginHeadingBox,
  LoginHeadingText,
  LoginText,
  InputContainer,
  LoginTextContainer,
  SubmitButtonContainer,
} from '@sb/compositions/Login/Login.styles'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'


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
    <LoginContainer>
      <LoginHeadingBox>
        <LoginHeadingText>Google Authentication</LoginHeadingText>
      </LoginHeadingBox>
      <LoginTextContainer container justify="space-around">
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <LoginText>
          Input the 6-digit code in your Google Authenticator app
        </LoginText>
      </LoginTextContainer>
      <LoginTextContainer>
        <OtpInput
          value={otp}
          onChange={(otp: string) => otpChangeHandler(otp)}
          numInputs={6}
          separator={<span>-</span>}
        />
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
          {errorMessage}
          </TypographyWithCustomColor>
        )}
      </LoginTextContainer>
      <LoginTextContainer>
        <LoginText onClick={() => changeStep('recoveryCode')}>
          Can't access Google Authenticator?
        </LoginText>
      </LoginTextContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(EnterOtp)
