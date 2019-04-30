import * as React from 'react'

import {
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'

import {
  MainContainer,
  StepContainer,
  MainWrapper,
  LogoWrapper,
  StepGrid,
  ContentGrid,
} from './styles'


const Onboarding = () => (
  <MainContainer>
    <Grid container>
      <StepGrid item>
        <StepContainer>
          <MainWrapper>
            <LogoWrapper>
              aaaa
            </LogoWrapper>
            <Typography variant="h5">
              Welcome to the future of crypto
            </Typography>
            <Typography variant="h6">
              Welcome to the future of crypto
            </Typography>
          </MainWrapper>
        </StepContainer>
      </StepGrid>
      <ContentGrid item>
        <Typography>
          Welcome to the future of crypto
        </Typography>
      </ContentGrid>
    </Grid>
  </MainContainer>
)

export default Onboarding
