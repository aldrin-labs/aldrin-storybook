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

import { PrivacyPolicy, TermsOfUse } from '@sb/components/index'
import { Loading } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import GoogleLogo from '@icons/googleLogo.svg'

import {
  LoginContainer,
  InputContainer,
  StyledInputLogin,
  SubmitButtonContainer,
  SubmitLoginButton,
  SmallGrayText,
  OrText,
  WithGoogleButton,
  WithGoogleButtonText,
  OrContainerText,
  TextLinkSpan,
} from '@sb/compositions/Login/Login.styles'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import { isEmailValid } from '@sb/compositions/Login/Login.utils'

const SignUp = ({
  theme,
  onSignUpWithGoogleClick,
  onSignUpButtonClick,
  status,
  errorMessage,
}: {
  theme: Theme
  // TODO: Need to replace any here
  onSignUpWithGoogleClick: () => any
  // TODO: Need to replace any here
  onSignUpButtonClick: ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => any
  status: 'error' | 'success'
  errorMessage: string
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgaing, setPasswordAgaing] = useState('')
  const [isAgreeWithRules, setAgreementWithRules] = useState(false)
  const [showPrivacyPolicy, togglePrivacyPolicy] = useState(false)
  const [showTermsOfUse, toggleTermsOfUse] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [agreementError, setAgreementError] = useState(false)


  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordAgaing, setShowPasswordAgaing] = useState(false)

  const [loading, setLoading] = useState(false)

  const toggleAgreementCheckbox = () => {
    setAgreementWithRules(!isAgreeWithRules)
    setAgreementError(false)
  }

  const isPasswordsValid = ({
    pass1,
    pass2,
  }: {
    pass1: string
    pass2: string
  }) => pass1 === pass2 && pass1 !== '' && pass2 !== ''

  return (
    <>
      <PrivacyPolicy
        open={showPrivacyPolicy}
        onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
      />
      <TermsOfUse
        open={showTermsOfUse}
        onClick={() => toggleTermsOfUse(!showTermsOfUse)}
      />
      <LoginContainer>
        <Grid container>
          <WithGoogleButton
            onClick={() => { 
              isAgreeWithRules ? onSignUpWithGoogleClick() : setAgreementError(true)
            }}
          >
            <Grid container alignItems="center" justify="center" wrap="nowrap">
              <SvgIcon src={GoogleLogo} width="2rem" height="auto" />
              <WithGoogleButtonText> Sign up with Google</WithGoogleButtonText>
            </Grid>
          </WithGoogleButton>
        </Grid>
        <OrContainerText>
          <OrText>Or</OrText>
        </OrContainerText>
        <InputContainer>
          <StyledInputLogin
            required
            type="email"
            id="email"
            name="email"
            autoComplete="on"
            error={!!emailError}
            placeholder={`E-mail`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
          />
        </InputContainer>
        <InputContainer>
          <StyledInputLogin
            required
            error={!!passwordError}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
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
        <InputContainer>
          <StyledInputLogin
            required
            error={!!passwordError}
            type={showPasswordAgaing ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPasswordAgaing(!showPasswordAgaing)}
                >
                  {showPasswordAgaing ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            placeholder={`Confirm password`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPasswordAgaing(e.target.value)
              setPasswordError('')
            }}
          />
        </InputContainer>
        {status === 'error' && errorMessage !== '' && (
          <Grid>
            <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
              {errorMessage}
            </TypographyWithCustomColor>
          </Grid>
        )}
        {passwordError !== '' && (
          <Grid>
            <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
              Passwords doesn't match
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
        {agreementError && (
          <Grid>
            <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
              You must agree to Terms of Use and Privacy Policy
            </TypographyWithCustomColor>
          </Grid>
        )}
        <InputContainer container justify="center" alignItems="center">
          <Checkbox
            checked={isAgreeWithRules}
            onChange={() => toggleAgreementCheckbox()}
          />
          <SmallGrayText>
            I agree to cryptocurrencies.ai{' '}
            <TextLinkSpan
              small={true}
              onClick={() => toggleTermsOfUse(!showTermsOfUse)}
            >
              Terms of Use,{' '}
            </TextLinkSpan>
            <TextLinkSpan
              small={true}
              onClick={() => togglePrivacyPolicy(!showPrivacyPolicy)}
            >
              Privacy Policy,{' '}
            </TextLinkSpan>
            and I’m over 18 years old.
          </SmallGrayText>
        </InputContainer>
        <SubmitButtonContainer>
          <SubmitLoginButton
            padding={'2rem 8rem'}
            variant="contained"
            color="secondary"
            disabled={!isAgreeWithRules || loading}
            onClick={async () => {
              const validPasswords = isPasswordsValid({
                pass1: password,
                pass2: passwordAgaing,
              })
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
              await onSignUpButtonClick({ email, password })
              setLoading(false)
            }}
          >
            {loading ? (
              <Loading size={16} style={{ height: '16px' }} />
            ) : (
              `Next`
            )}
          </SubmitLoginButton>
        </SubmitButtonContainer>
      </LoginContainer>
    </>
  )
}

export default compose(withTheme)(SignUp)
