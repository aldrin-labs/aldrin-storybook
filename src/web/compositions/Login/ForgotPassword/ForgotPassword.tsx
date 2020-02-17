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
} from '@sb/compositions/Login/Login.styles'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

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
          type="email"
          placeholder="E-mail"
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
        <SubmitLoginButton
          variant="contained"
          color="secondary"
          onClick={() => onForgotPasswordClick({ email })}
        >
          Confirm and go to the mailbox
        </SubmitLoginButton>
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(ForgotPassoword)
