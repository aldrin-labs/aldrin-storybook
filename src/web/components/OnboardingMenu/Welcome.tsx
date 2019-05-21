import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
  ContentContainer,
  WelcomeTextContainer,
} from './styles'

export const Welcome = (props) => (
  <Wrapper>
    <Typography
      variant="h5"
      color="secondary"
      align="center"
    >
      Welcome to Cryptocurrencies.ai
    </Typography>
    <ContentContainer>
      <WelcomeTextContainer>
      <StyledTypography
        color="inherit"
        align="center"
      >
        Our entire platform is designed to help you optimize and
        maximize your portfolio. To better understand your needs, we
        would first like to ask you a few questions.
      </StyledTypography>
      </WelcomeTextContainer>
    </ContentContainer>
    <ButtonContainer>
      <StyledBeginButton onClick={() => props.changePage('Questions')}>
        Let's begin
      </StyledBeginButton>
    </ButtonContainer>
    <Link
      onClick={() => props.changePage('ChooseExchange')}
      variant="body2"
    >
      No thanks. Continue.
    </Link>
  </Wrapper>
)

export default Welcome
