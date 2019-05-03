import * as React from 'react'

import {
  Grid,
} from '@material-ui/core'

import stepOne from '@icons/stepOne.png'
import stepTwo from '@icons/stepTwo.png'
import MainLogoWhite from '@icons/MainLogoWhite.png'


import {
  MainContainer,
  StepContainer,
  MainWrapper,
  LogoWrapper,
  StepGrid,
  ContentGrid,
  TextContainer,
  StepWrapper,
  StepIconGrid,
  StyledTypography,
  StepTextContainer,
  StepTextWrapper,
  StyledLink,
  StepsLogo,
  Logo,
} from './styles'


const Steps = (props) => (
      <StepGrid item>
        <StepContainer>
          <MainWrapper>
            <LogoWrapper>
              <Logo src={MainLogoWhite} />
            </LogoWrapper>
            <StyledTypography
              variant="h5"
              weight="bold"
            >
              Welcome to the future of crypto
            </StyledTypography>
            <TextContainer>
              <StyledTypography variant="subtitle1">
                Unlock our platform and start changing the way you trade.
              </StyledTypography>
            </TextContainer>
            <StepWrapper>
              <Grid container>
                <StepIconGrid item>
                  <StepsLogo src={props.step === 'first' ? stepOne : stepTwo} />
                </StepIconGrid>
                <StepTextWrapper item>
                  <StepTextContainer>
                    <StyledTypography
                      variant="h6"
                      weight="bold"
                    >
                      Create your free account
                    </StyledTypography>
                  </StepTextContainer>
                  <StyledTypography
                    variant="h6"
                    weight={props.step === 'second' ? 'bold' : 'normal'}
                  >
                    Launch Beta
                  </StyledTypography>
                </StepTextWrapper>
              </Grid>
            </StepWrapper>
            <StyledTypography variant="subtitle1">
              Already have an account?
              <StyledLink
                href={'aaa'}
                weight="bold"
                color="inherit"
              >
                Log in
              </StyledLink>
            </StyledTypography>
          </MainWrapper>
        </StepContainer>
      </StepGrid>
)

export default Steps
