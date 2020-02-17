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

export const WithGoogleButtonCss = css`
  width: 100%;
  background: #ffffff;
  box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.4);
  padding: 1.7rem;
`

export const WithGoogleButtonTextCss = css`
  color: #16253d;
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 98.6%;
  letter-spacing: 0.5px;
  text-transform: initial;

  padding-left: 3.5rem;
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
  width: 100%;
  text-align: center;
  padding: 0 1rem 1rem 1rem;
  border-bottom: 2px solid #e7ecf3;
`

export const LoginTextContainerCss = css`
  padding-bottom: 3rem;
`

export const LoginSubHeadingBoxCss = css`
  padding-top: 5rem;
  ${LoginTextContainerCss}
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
  display: block;
  background: #165be0;
`

export const LoginGoogleAuthHeadingTextCss = css`
  ${LoginTextCss}
  padding-left: 3rem;
`

export const TextLinkCss = css`
  font-weight: 500;
  font-size: 1.6rem;
  color: #165be0;
  cursor: pointer;
`

export const TextSmallCss = css`
  line-height: 100%;
  font-size: 1rem;
`

export const OtpInputContainerCss = css`
  & > div {
    padding: 1rem;
  }
`

export const GrayText = css`
  color: #5e6b83;
`

export const OrTextCss = css`
  padding: 1.8rem 1.5rem;
  font-size: 1rem;
  color: #16253d;
  letter-spacing: 0.03em;

  &::before,
  &::after {
    background-color: #0b1fd0;
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  &::before {
    right: 0.5em;
    margin-left: -50%;
  }

  &::after {
    left: 0.5em;
    margin-right: -50%;
  }
`

export const OrContainerTextCss = css`
  width: 100%;
  text-align: center;
`

export const RememberMeContainerCss = css`
  width: auto;
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

export const SubmitLoginButton = styled(({ padding, ...props }) => (
  <Button {...props} />
))`
  ${SubmitLoginButtonCss}
  ${({ padding }) => (padding ? `padding: ${padding};` : '')}
`

export const SubmitButtonContainer = styled(({ ...props }) => (
  <Grid {...props} />
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

export const LoginText = styled(({ ...props }) => <Typography {...props} />)`
  ${LoginTextCss}
`

export const StyledInputLogin = styled(({ ...props }) => (
  <Outlined {...props} />
))`
  width: 100%;
  background: #fff;
  height: 6.3rem;
  border-radius: 8px;

  & input {
    font-size: 2rem;
    color: #5E6B83;
    text-align: left;
  }

  & input::placeholder {
    color: #bec5cf;
  }
`

export const SubmitLoginLink = styled(({ ...props }) => <Link {...props} />)`
  ${SubmitLoginButtonCss}
  ${LoginLinkCss}
`

export const LoginSubHeadingBox = styled(({ ...props }) => <Grid {...props} />)`
  ${LoginSubHeadingBoxCss}
`

export const LoginGoogleAuthHeadingText = styled(({ ...props }) => (
  <Typography {...props} />
))`
  ${LoginGoogleAuthHeadingTextCss}
`

export const TextLink = styled(({ small, ...props }) => (
  <Typography {...props} />
))`
  ${TextLinkCss}
  ${(props) => (props.small ? TextSmallCss : ``)}
`

export const SmallGrayText = styled(({ bold, ...props }) => (
  <Typography {...props} />
))`
  ${TextSmallCss}
  ${GrayText}
  ${({ bold }) => (bold ? 'font-weight: bold;' : '')}
`

export const OrText = styled(({ bold, ...props }) => <Typography {...props} />)`
  ${OrTextCss}
`

export const WithGoogleButton = styled(({ bold, ...props }) => (
  <Button {...props} />
))`
  ${WithGoogleButtonCss}
`

export const WithGoogleButtonText = styled(({ bold, ...props }) => (
  <Typography {...props} />
))`
  ${WithGoogleButtonTextCss}
`

export const OrContainerText = styled(({ ...props }) => <Grid {...props} />)`
  ${OrContainerTextCss}
`

export const RememberMeContainer = styled(({ ...props }) => (
  <Grid {...props} />
))`
  ${RememberMeContainerCss}
`

export const TextLinkSpan = styled(({ small, ...props }) => (
  <span {...props} />
))`
  ${TextLinkCss}
  ${(props) => (props.small ? TextSmallCss : ``)}
`
