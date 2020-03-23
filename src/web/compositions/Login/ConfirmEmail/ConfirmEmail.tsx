import React from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import CubeLogo from '@icons/auth0Logo.png'
import { Logo } from './ConfirmEmail.styles'

import {
  LoginContainer,
  LoginHeadingBox,
  LoginHeadingText,
  LoginText,
  LoginTextContainer,
  SubmitButtonContainer,
  SubmitLoginLink,
} from '@sb/compositions/Login/Login.styles'

const ConfirmEmail = ({
  theme,
  userEmailHosting,
}: {
  theme: Theme
  userEmailHosting: string
}) => {
  return (
    <LoginContainer>
      <LoginTextContainer container justify="center" alignItems="center">
        <Logo src={CubeLogo} />
      </LoginTextContainer>
      <LoginHeadingBox>
        <LoginHeadingText>Confirm your e-mail</LoginHeadingText>
      </LoginHeadingBox>
      <LoginTextContainer>
        <LoginText>Thank you for joining cryptocurrencies.ai</LoginText>
      </LoginTextContainer>
      <LoginTextContainer>
        <LoginText>
          We have sent a confirmation email to the address indicated during your
          registration.
        </LoginText>
      </LoginTextContainer>
      <SubmitButtonContainer>
        <SubmitLoginLink
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          variant="body2"
          href={`https://${userEmailHosting}`}
        >
          Go to e-mail and confirm
        </SubmitLoginLink>
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme())(ConfirmEmail)
