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
  FormContainer,
} from '@sb/compositions/Login/Login.styles'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'
import ConfirmTermsOfUsePopup from '@sb/compositions/Login/ConfirmTermsOfUsePopup/ConfirmTermsOfUsePopup'

import { isEmailValid, scorePassword } from '@sb/compositions/Login/Login.utils'
import { addGAEvent } from '@core/utils/ga.utils'

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
  const [showConfirmTermsOfUse, toggleConfirmTermsOfUse] = useState(false)

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

  const [passwordScore, variations] = scorePassword(password)
  const passwordLevel =
    passwordScore < 40 ||
    !(
      variations.digits &&
      variations.lower &&
      variations.upper &&
      password.length >= 8
    )
      ? 'Low'
      : passwordScore > 70
      ? 'High'
      : 'Medium'
  const isPassworkQuality = () => {
    return (
      variations.digits &&
      variations.lower &&
      variations.upper &&
      password.length >= 8
    )
  }

  const signUpWithGoogleAndAnalytics = () => {
    addGAEvent({
      action: 'Sign up',
      category: 'App - Sign up with google',
      label: `sign_up_app`,
    })

    onSignUpWithGoogleClick()
  }

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
      <ConfirmTermsOfUsePopup
        open={showConfirmTermsOfUse}
        confirmHandler={signUpWithGoogleAndAnalytics}
        isAgreeWithRules={isAgreeWithRules}
        showPrivacyPolicy={showPrivacyPolicy}
        showTermsOfUse={showTermsOfUse}
        toggleAgreementCheckbox={toggleAgreementCheckbox}
        togglePrivacyPolicy={togglePrivacyPolicy}
        toggleTermsOfUse={toggleTermsOfUse}
        onClose={() => toggleConfirmTermsOfUse(!showConfirmTermsOfUse)}
      />
      <LoginContainer>
        <Grid container>
          <WithGoogleButton
            onClick={() => {
              isAgreeWithRules
                ? signUpWithGoogleAndAnalytics()
                : toggleConfirmTermsOfUse(!showConfirmTermsOfUse)
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
        <FormContainer
          action=""
          onSubmit={async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!isAgreeWithRules) {
              setAgreementError(true)
              return
            }

            const validPasswords = isPasswordsValid({
              pass1: password,
              pass2: passwordAgaing,
            })
            const validEmail = isEmailValid({ email })

            if (!isPassworkQuality()) {
              setPasswordError(`Create better password for your safety`)
              return
            }
            if (!validPasswords) {
              setPasswordError(`Passwords doesn't match`)
              return
            }
            if (!validEmail) {
              setEmailError(`Email is not valid`)
              return
            }

            addGAEvent({
              action: 'Sign up',
              category: 'App - Sign up regular',
              label: `sign_up_app`,
            })

            setLoading(true)
            await onSignUpButtonClick({ email, password })
            setLoading(false)
          }}
        >
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
          <InputContainer style={{ paddingBottom: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
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
              {password !== '' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '.5rem',
                    borderRadius: '.2rem',
                    width:
                      passwordLevel === 'Low'
                        ? '30%'
                        : passwordLevel === 'Medium'
                        ? '60%'
                        : '100%',
                    backgroundColor:
                      passwordLevel === 'Low'
                        ? '#E9422E'
                        : passwordLevel === 'Medium'
                        ? '#DCDE67'
                        : '#24A17A',
                  }}
                />
              )}
            </div>
            {password !== '' && (
              <span
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: '2rem',
                  color: '#5E6B83',
                }}
              >
                {passwordLevel}. Use at least 8 characters, a mix of letters,
                numbers and symbols. <b>It's for your own safety.</b>
              </span>
            )}
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
              <TypographyWithCustomColor
                textColor={theme.customPalette.red.main}
              >
                {errorMessage}
              </TypographyWithCustomColor>
            </Grid>
          )}
          {passwordError !== '' && (
            <Grid>
              <TypographyWithCustomColor
                textColor={theme.customPalette.red.main}
              >
                {passwordError}
              </TypographyWithCustomColor>
            </Grid>
          )}
          {emailError !== '' && (
            <Grid>
              <TypographyWithCustomColor
                textColor={theme.customPalette.red.main}
              >
                Email is not valid
              </TypographyWithCustomColor>
            </Grid>
          )}
          {agreementError && (
            <Grid>
              <TypographyWithCustomColor
                textColor={theme.customPalette.red.main}
              >
                You must agree to Terms of Use and Privacy Policy
              </TypographyWithCustomColor>
            </Grid>
          )}
          <InputContainer container justify="center" alignItems="center">
            <Checkbox
              required
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
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <Loading size={16} style={{ height: '16px' }} />
              ) : (
                `Next`
              )}
            </SubmitLoginButton>
          </SubmitButtonContainer>
        </FormContainer>
      </LoginContainer>
    </>
  )
}

export default compose(withTheme())(SignUp)
