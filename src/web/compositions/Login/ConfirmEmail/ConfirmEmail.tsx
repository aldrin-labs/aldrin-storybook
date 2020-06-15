import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { Theme, Grid } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import CubeLogo from '@icons/auth0Logo.png'
import { Logo } from './ConfirmEmail.styles'
import { Loading } from '@sb/components/index'

import {
  LoginContainer,
  LoginHeadingBox,
  LoginHeadingText,
  LoginText,
  LoginTextContainer,
  SubmitButtonContainer,
  SubmitLoginLink,
  ConfirmEmailContainer,
  TextLink,
  SendVerificationEmailTextContainer,
} from '@sb/compositions/Login/Login.styles'

const ConfirmEmail = ({
  theme,
  userEmailHosting,
  onLogout = async () => {},
  userId,
  accessToken,
  sendConfirmEmailAgaingHandler,
}: {
  theme: Theme
  userEmailHosting: string
  onLogout: () => Promise<void>
  sendConfirmEmailAgaingHandler: ({
    userId,
    accessToken,
  }: {
    userId: string
    accessToken: string
  }) => Promise<void>
  userId: string
  accessToken: string
}) => {
  useEffect(() => {
    return () => {
      onLogout()
    }
  }, [])

  const [loading, setLoading] = useState(false)

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
      <SendVerificationEmailTextContainer>
        {loading === false && (
          <TextLink
            onClick={async () => {
              setLoading(true)
              await sendConfirmEmailAgaingHandler({ userId, accessToken })
              setLoading(false)
            }}
          >
            Didn't receive an email?
          </TextLink>
        )}
        {loading && <Loading size={16} style={{ height: '16px' }} />}
      </SendVerificationEmailTextContainer>
    </LoginContainer>
  )
}

export default compose(withTheme())(ConfirmEmail)
