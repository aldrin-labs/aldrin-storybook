import React, { useState, ChangeEvent } from 'react'
import { compose } from 'recompose'
import { Grid, Typography, Theme, Input, Button } from '@material-ui/core'
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
  LoginTextContainer,
  LoginText,
  TextLink,
  StyledInputLogin,
} from '@sb/compositions/Login/Login.styles'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

const EnterRecoveryCode = ({
  theme,
  enterRecoveryCodeHandler,
  status,
  errorMessage,
  newRecoveryCode,
  processAuthentificationHandler,
}: {
  theme: Theme
  enterRecoveryCodeHandler: (recoveryCode: string) => void
  status: 'error' | 'success'
  errorMessage: string
  newRecoveryCode: string
  processAuthentificationHandler: () => void
}) => {
  const [recoveryCode, setRecoveryCode] = useState('')

  return (
    <LoginContainer>
      <LoginHeadingBox>
        <LoginHeadingText>Google Authentication</LoginHeadingText>
      </LoginHeadingBox>
      <LoginSubHeadingBox container alignItems="center" wrap="nowrap">
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <Typography>Input your 2FA recovery code here:</Typography>
      </LoginSubHeadingBox>
      <InputContainer>
        <StyledInputLogin
          value={recoveryCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRecoveryCode(e.target.value)
          }
        />
        {status === 'error' && errorMessage !== '' && (
          <TypographyWithCustomColor textColor={theme.customPalette.red.main}>
            {errorMessage}
          </TypographyWithCustomColor>
        )}
      </InputContainer>
      {status === 'success' && errorMessage === '' && (
        <LoginTextContainer>
          <LoginText>New recovery code:</LoginText>
          <LoginText>
            {newRecoveryCode}
            </LoginText>
        </LoginTextContainer>
      )}
      <Grid>
        <Button
          disabled={newRecoveryCode}
          onClick={() => enterRecoveryCodeHandler(recoveryCode)}
        >
          Confirm
        </Button>
        {newRecoveryCode && (
          <Button onClick={() => processAuthentificationHandler()}>
            Go to App
          </Button>
        )}
      </Grid>
    </LoginContainer>
  )
}

export default compose(withTheme)(EnterRecoveryCode)
