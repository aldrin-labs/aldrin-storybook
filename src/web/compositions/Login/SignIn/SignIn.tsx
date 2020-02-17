import React, { ChangeEvent, useState } from 'react'
import { compose } from 'recompose'
import {
  Grid,
  Theme,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@material-ui/core'

import { Visibility, VisibilityOff } from '@material-ui/icons/'
import { withTheme } from '@material-ui/styles'

import SvgIcon from '@sb/components/SvgIcon'
import GoogleLogo from '@icons/googleLogo.svg'

import {
  LoginContainer,
  InputContainer,
  StyledInputLogin,
  SubmitButtonContainer,
  SubmitLoginButton,
  TextLink,
  SmallGrayText,
  OrText,
  WithGoogleButton,
  WithGoogleButtonText,
  OrContainerText,
  RememberMeContainer,
} from '@sb/compositions/Login/Login.styles'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

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
  const [showPassword, setShowPassword] = useState(false)

  return (
    <LoginContainer>
      <Grid container>
        <WithGoogleButton onClick={() => onLoginWithGoogleClick()}>
          <Grid container alignItems="center" justify="center" wrap="nowrap">
            <SvgIcon src={GoogleLogo} width="2rem" height="auto" />
            <WithGoogleButtonText>Log in with Google</WithGoogleButtonText>
          </Grid>
        </WithGoogleButton>
      </Grid>
      <OrContainerText>
        <OrText>Or</OrText>
      </OrContainerText>
      <InputContainer>
        <StyledInputLogin
          placeholder={`E-mail`}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </InputContainer>
      <InputContainer>
        <StyledInputLogin
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          placeholder={`Password`}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </InputContainer>
      <Grid>
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            {errorMessage}
          </TypographyWithCustomColor>
        )}
      </Grid>
      <InputContainer container justify="space-between" alignItems="center">
        <RememberMeContainer container alignItems="center">
          <Checkbox />
          <SmallGrayText>Remember me</SmallGrayText>
        </RememberMeContainer>
        <Grid>
          <TextLink small={true} onClick={() => changeStep('forgotPassword')}>
            Forgot password?
          </TextLink>
        </Grid>
      </InputContainer>
      <SubmitButtonContainer>
        <SubmitLoginButton
          padding={'2rem 8rem'}
          variant="contained"
          color="secondary"
          onClick={() => onLoginButtonClick({ username: email, password })}
        >
          Log In
        </SubmitLoginButton>
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(SignIn)
