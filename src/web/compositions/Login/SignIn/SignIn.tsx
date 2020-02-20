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

import { Loading } from '@sb/components/index'
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
import { isEmailValid } from '@sb/compositions/Login/Login.utils'

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

  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRememberMe, toggleRememberMe] = useState(true)

  const isPasswordValid = ({ password }: { password: string }) =>
    !!password.length

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
          type="email"
          id="email"
          name="email"
          autocomplete="on"
          placeholder={`E-mail`}
          error={!!emailError}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
            setEmailError('')
          }}
        />
      </InputContainer>
      <InputContainer>
        <StyledInputLogin
          error={!!passwordError}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                tabIndex={-1}
                aria-label="Toggle password visibility"
                onClick={() => {
                  setShowPassword(!showPassword)
                  setPasswordError('')
                }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          placeholder={`Password`}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
            setPasswordError('')
          }}
        />
      </InputContainer>
      <Grid>
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            {errorMessage}
          </TypographyWithCustomColor>
        )}
      </Grid>
      {passwordError !== '' && (
        <Grid>
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            Password is empty
          </TypographyWithCustomColor>
        </Grid>
      )}
      {emailError !== '' && (
        <Grid>
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            Email is not valid
          </TypographyWithCustomColor>
        </Grid>
      )}
      <InputContainer container justify="space-between" alignItems="center">
        <RememberMeContainer container alignItems="center">
          <Checkbox
            checked={isRememberMe}
            onChange={() => toggleRememberMe(!isRememberMe)}           
           />
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
          disabled={loading}
          padding={'2rem 8rem'}
          variant="contained"
          color="secondary"
          onClick={async () => {
            const validPasswords = isPasswordValid({ password })
            const validEmail = isEmailValid({ email })

            if (!validPasswords) {
              setPasswordError(`Passwords doesn't match`)
              return
            }

            if (!validEmail) {
              setEmailError(`Email is not valid`)
              return
            }
            setLoading(true)
            await onLoginButtonClick({ username: email, password })
            setLoading(false)
          }}
        >
          {loading ? (
            <Loading size={16} style={{ height: '16px' }} />
          ) : (
            `Log In`
          )}
        </SubmitLoginButton>
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(SignIn)
