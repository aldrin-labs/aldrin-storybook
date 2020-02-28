import React, { useState, ChangeEvent } from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
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
  StyledInputLogin,
  SubmitButtonContainer,
  SubmitLoginButton,
  MfaBackupText,
  MfaBackupCode,
} from '@sb/compositions/Login/Login.styles'
import { Loading } from '@sb/components/index'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

const EnterRecoveryCode = ({
  theme,
  enterRecoveryCodeHandler,
  status,
  errorMessage,
  newRecoveryCode,
  processAuthentificationHandler,
  forWithdrawal,
}: {
  theme: Theme
  enterRecoveryCodeHandler: (recoveryCode: string) => Promise<void>
  status: 'error' | 'success'
  errorMessage: string
  newRecoveryCode: string
  processAuthentificationHandler: () => void
  forWithdrawal: boolean
}) => {
  const [recoveryCode, setRecoveryCode] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <LoginContainer forWithdrawal={forWithdrawal}>
      <LoginHeadingBox>
        <LoginHeadingText>Google Authentication</LoginHeadingText>
      </LoginHeadingBox>
      <LoginSubHeadingBox container alignItems="center" wrap="nowrap">
        <SvgIcon src={GoogleAuthenticationLogo} width="3.5rem" height="auto" />
        <LoginGoogleAuthHeadingText>
          Input your 2FA recovery code here:
        </LoginGoogleAuthHeadingText>
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
        <LoginTextContainer
          container
          alignItems="center"
          direction="column"
        >
          <MfaBackupText>New recovery code:</MfaBackupText>
          <MfaBackupCode>{newRecoveryCode}</MfaBackupCode>
        </LoginTextContainer>
      )}
      <SubmitButtonContainer>
        {!newRecoveryCode && (
          <SubmitLoginButton
            variant="contained"
            color="secondary"
            disabled={newRecoveryCode || loading}
            onClick={async () => {
              setLoading(true)
              await enterRecoveryCodeHandler(recoveryCode)
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
        {newRecoveryCode && (
          <SubmitLoginButton
            disabled={loading}
            variant="contained"
            color="secondary"
            onClick={async () => {
              setLoading(true)
              await processAuthentificationHandler()
              setLoading(false)
            }}
          >
            {loading ? (
              <Loading size={16} style={{ height: '16px' }} />
            ) : (
              `Go to App`
            )}
          </SubmitLoginButton>
        )}
      </SubmitButtonContainer>
    </LoginContainer>
  )
}

export default compose(withTheme)(EnterRecoveryCode)
