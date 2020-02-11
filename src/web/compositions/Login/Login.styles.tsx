import React from 'react'
import styled, { css } from 'styled-components'
import { Grid, Typography, Button, Theme } from '@material-ui/core'

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
