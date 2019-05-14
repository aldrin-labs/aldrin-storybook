import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
  ContentContainer,
} from './styles'

export default class Welcome extends React.Component {

  render() {
    return (
      <Wrapper>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
        >
          Welcome to Cryptocurrencies.ai
        </Typography>
        <ContentContainer>
          <StyledTypography
            color="inherit"
            align="center"
          >
              Our entire platform is designed to help you optimize and
              maximize your portfolio. To better understand your needs, we
              would first like to ask you a few questions.
            </StyledTypography>
          </ContentContainer>
          <ButtonContainer>
            <StyledBeginButton>
              Let's begin
            </StyledBeginButton>
          </ButtonContainer>
          <Link
            variant="body2"
          >
            No thanks. Continue.
          </Link>
      </Wrapper>
    )
  }
}
