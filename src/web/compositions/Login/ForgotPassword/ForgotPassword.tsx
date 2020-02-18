import React, { ChangeEvent, useState } from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

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
  LoginSubHeadingBox,
  SubmitLoginLink,
} from '@sb/compositions/Login/Login.styles'
import { Loading } from '@sb/components/index'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'
import { isEmailValid } from '@sb/compositions/Login/Login.utils'


const ForgotPassoword = ({
  theme,
  onForgotPasswordClick,
  status,
  errorMessage,
}: {
  theme: Theme
  // TODO: Need to replace any here
  onForgotPasswordClick: ({ email }: { email: string }) => any
  status: 'error' | 'success'
  errorMessage: string
}) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const getEmailDomain = ({ email = '' }: { email: string }) => {
    const emailDomain = email.replace(/.*@/, '')
    return emailDomain
  }

  return (
    <LoginContainer>
      <LoginHeadingBox>
        <LoginHeadingText>Forgot your password?</LoginHeadingText>
      </LoginHeadingBox>
      <LoginSubHeadingBox>
        <LoginText>
          Enter the e-mail address to which your account is registered. We will
          send you a link to reset your password.
        </LoginText>
      </LoginSubHeadingBox>
      <InputContainer>
        <StyledInputLogin
          disabled={status === 'success' && errorMessage === ''}
          error={!!emailError}
          id="email"
          name="email"
          autocomplete="on"
          type="email"
          placeholder={`E-mail`}
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </InputContainer>
      <LoginTextContainer>
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            {errorMessage}
          </TypographyWithCustomColor>
        )}
        {status === 'success' && errorMessage === '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.green.main}>
            We've just sent you an email to reset your password
          </TypographyWithCustomColor>
        )}
      </LoginTextContainer>
      <SubmitButtonContainer>
        {status !== 'success' && (
          <SubmitLoginButton
            disabled={loading}
            variant="contained"
            color="secondary"
            onClick={async () => {
              const validEmail = isEmailValid({ email })
              if (!validEmail) {
                setEmailError(`Email is not valid`)
                return
              }
              setLoading(true)
              await onForgotPasswordClick({ email })
              setLoading(false)
            }}
          >
            {loading ? (
              <Loading size={16} style={{ height: '16px' }} />
            ) : (
              `Confirm`
            )}
          </SubmitLoginButton>
        )}
        {status === 'success' && errorMessage === '' && (
          <SubmitLoginLink
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            variant="body2"
            href={`https://${getEmailDomain({ email })}`}
          >
            Go to e-mail
          </SubmitLoginLink>
        )}
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(ForgotPassoword)
