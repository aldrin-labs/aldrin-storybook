import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { compose } from 'recompose'
import { Theme, Grid } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import SvgIcon from '@sb/components/SvgIcon'

import GoogleAuthenticationLogo from '@icons/googleAuthentication.svg'

import {
  LoginContainer,
  LoginHeadingBox,
  LoginHeadingText,
  InputContainer,
  LoginSubHeadingBox,
  LoginGoogleAuthHeadingText,
  TextLink,
  OtpLoaderContainer,
} from '@sb/compositions/Login/Login.styles'
import { Loading } from '@sb/components/index'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

const EnterOtp = ({
  theme,
  changeStep,
  status,
  errorMessage,
  otpCompleteHandler,
  forWithdrawal,
}: {
  theme: Theme
  changeStep: (step: string) => void
  otpCompleteHandler: (otp: string) => Promise<void>
  status: 'error' | 'success'
  errorMessage: string
  forWithdrawal
}) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const otpChangeHandler = async (otp: string) => {
    setOtp(otp)

    if (otp.length === 6) {
      setLoading(true)
      await otpCompleteHandler(otp)
      setLoading(false)
    }
  }

  return (
    <LoginContainer forWithdrawal={forWithdrawal}>
      <LoginHeadingBox>
        <LoginHeadingText>Google Authentication</LoginHeadingText>
      </LoginHeadingBox>
      <LoginSubHeadingBox container alignItems="center" wrap="nowrap">
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <LoginGoogleAuthHeadingText>
          Input the 6-digit code in your Google Authenticator app
        </LoginGoogleAuthHeadingText>
      </LoginSubHeadingBox>
      <InputContainer>
        <OtpLoaderContainer container justify="center" alignItems="center">
          {loading ? <Loading size={16} style={{ height: '16px' }} /> : null}
        </OtpLoaderContainer>
        <OtpInput
          containerStyle={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          inputStyle={{
            width: '1.4em',
            height: '1.5em',
            textAlign: 'center',
            fontSize: '3.2rem',
            fontWeight: 'bold',
            background: 'transparent',
            outline: 'none',
            border: '0',
            borderBottom: '2px solid #0B1FD1',
          }}
          shouldAutoFocus
          value={otp}
          onChange={async (otp: string) => await otpChangeHandler(otp)}
          numInputs={6}
          separator={<span style={{ padding: '1rem' }}> </span>}
        />
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            {errorMessage}
          </TypographyWithCustomColor>
        )}
      </InputContainer>
      <Grid>
        <TextLink onClick={() => changeStep('recoveryCode')}>
          Can't access Google Authenticator?
        </TextLink>
      </Grid>
    </LoginContainer>
  )
}

export default compose(withTheme())(EnterOtp)
