import React from 'react'
import { compose } from 'recompose'
import { Theme, Grid } from '@material-ui/core'
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
  ConfirmEmailContainer,
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
      <Grid container justify="center" alignItems="center">
        <Logo src={CubeLogo} />
      </Grid>
      <LoginHeadingBox>
        <LoginHeadingText>Confirm your e-mail</LoginHeadingText>
      </LoginHeadingBox>
      <ConfirmEmailContainer>
        <LoginText>Thank you for joining cryptocurrencies.ai</LoginText>
      </ConfirmEmailContainer>
      <LoginTextContainer>
        <LoginText align="center">
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
