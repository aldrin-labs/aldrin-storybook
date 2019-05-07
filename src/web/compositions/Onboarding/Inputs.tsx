import * as React from 'react'

import {
  Link,
} from '@material-ui/core'

import facebook from '@icons/facebook.svg'
import googlePlus from '@icons/googlePlus.svg'

import SvgIcon from '@sb/components/SvgIcon/'

import {
  StyledTypography,
  StyledLink,
  InputContainer,
  InputTextField,
  ButtonsWrapper,
  StyledButton,
  FacebookButton,
  SocialContainer,
  GoogleButton,
  ContentGrid,
  GoolgeSvgContainer,
  SocialSvgContainer,
} from './styles'

const Inputs = (props) => (
  <ContentGrid item>
    <InputContainer>
      <Link
        color="secondary"
        variant="caption"
      >
        Learn how we use your information
      </Link>
      <InputTextField
        fullWidth
        id="standard-name"
        label="Full Name"
        margin="normal"
      />
      <InputTextField
        fullWidth
        id="standard-name"
        label="Email"
        margin="normal"
      />
      <InputTextField
        fullWidth
        id="standard-name"
        label="Password"
        margin="normal"
      />
      <InputTextField
        fullWidth
        id="standard-name"
        label="Confirm Password"
        margin="normal"
      />
    </InputContainer>
    <ButtonsWrapper>
      <StyledButton
        onClick={props.changeStep}
        fullWidth
      >
          create account
      </StyledButton>
      <SocialContainer>
        <FacebookButton>
          <SocialSvgContainer>
            <SvgIcon src={facebook} />
          </SocialSvgContainer>
          Using Facebook
        </FacebookButton>
        <GoogleButton onClick={props.loginWithGoogle}>
          <GoolgeSvgContainer>
            <SvgIcon src={googlePlus} />
          </GoolgeSvgContainer>
          Using Google
        </GoogleButton>
      </SocialContainer>
    </ButtonsWrapper>
    <StyledTypography variant="caption">
      By registration you agree to our
      <StyledLink
          color="secondary"
          variant="caption"
        >
          {`Terms & Consitions`}
        </StyledLink>
    </StyledTypography>
  </ContentGrid>
)

export default Inputs
