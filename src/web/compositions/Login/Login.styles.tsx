import React from 'react'
import styled, { css } from 'styled-components'
import { Grid, Typography, Button, Link } from '@material-ui/core'

import { Outlined } from '@sb/compositions/Profile/compositions/Withdrawal/Withdrawal.styles'

export const MfaHeadingCss = css`
  font-weight: bold;
  font-size: 4rem;
  letter-spacing: 0.01em;
  color: #16253d;
`

export const MfaStepCss = css`
  font-weight: bold;
  font-size: 1.6rem;
  line-height: 21px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #abbad1;
`

export const MfaSubHeadingCss = css`
  font-weight: bold;
  font-size: 1.8rem;
  line-height: 23px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7284a0;
`

export const MfaTextCss = css`
  font-size: 2.4rem;
  color: #16253d;
`

export const MfaBackupTextCss = css`
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export const MfaBackupCodeCss = css`
  ${MfaBackupTextCss}
  color: #0b1fd1;
`

export const SubmitLoginButtonCss = css`
  padding: 2rem 3rem;
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 109.6%;
  letter-spacing: 1.5px;
  border-radius: 4px;
  box-shadow: rgba(8, 22, 58, 0.3) 0px 8px 12px;
`

export const LoginContainerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  position: relative;
  padding: 3rem 6rem;
  background: #edf5f5;
`

export const LoginHeadingTextCss = css`
  font-weight: bold;
  font-size: 2.4rem;
  line-height: 100%;

  color: #16253d;
`

export const LoginTextCss = css`
  font-size: 2rem;
  line-height: 100%;

  color: rgba(22, 37, 61, 0.84);
`

export const LoginHeadingBoxCss = css`
  padding: 0 1rem 5rem 1rem;
  border-bottom: 2px solid #e7ecf3;
`

export const LoginTextContainerCss = css`
  padding-bottom: 3rem;
`

export const InputContainerCss = css`
  ${LoginTextContainerCss}
  width: 100%;
`

export const SubmitButtonContainerCss = css`
  position: absolute;
  bottom: -2.5rem;
`

export const LoginLinkCss = css`
  background: #165BE0;  
`

export const MfaHeading = styled(({ ...props }) => <Typography {...props} />)`
  ${MfaHeadingCss}
`

export const MfaStep = styled(({ ...props }) => <Typography {...props} />)`
  ${MfaStepCss}
`

export const MfaSubHeading = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${MfaSubHeadingCss}
`

export const MfaText = styled(({ ...props }) => <Typography {...props} />)`
  ${MfaTextCss}
`

export const MfaBackupText = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${MfaBackupTextCss}
`

export const MfaBackupCode = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${MfaBackupCodeCss}
`

export const SubmitLoginButton = styled(({ ...props }) => (
  <Button {...props} />
))`
  ${SubmitLoginButtonCss}
`

export const SubmitButtonContainer = styled(({ ...props }) => (
  <Button {...props} />
))`
  ${SubmitButtonContainerCss}
`

export const LoginHeadingBox = styled(({ ...props }) => <Grid {...props} />)`
  ${LoginHeadingBoxCss}
`

export const LoginContainer = styled(({ ...props }) => <Grid {...props} />)`
  ${LoginContainerCss}
`

export const InputContainer = styled(({ ...props }) => <Grid {...props} />)`
  ${InputContainerCss}
`

export const LoginTextContainer = styled(({ ...props }) => <Grid {...props} />)`
  ${LoginTextContainerCss}
`

export const LoginHeadingText = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${LoginHeadingTextCss}
`

export const LoginText = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${LoginTextCss}
`

export const StyledInputLogin = styled(({ ...props }) => (
  <Outlined {...props} />
))`
  width: 100%;
  background: #fff;

  & input {
    font-size: 2rem;
    color: #bec5cf;
    text-align: left;
  }
`

export const SubmitLoginLink = styled(({ ...props }) => (
    <Link {...props} />
  ))`
    ${SubmitLoginButtonCss}
    ${LoginLinkCss}
  `