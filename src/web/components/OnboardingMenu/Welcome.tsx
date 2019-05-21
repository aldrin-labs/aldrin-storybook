import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


import {
  Wrapper,
  HeaderContainer,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
} from './styles'

export default class Welcome extends React.Component {

  render() {
    return (
      <Wrapper>
        <HeaderContainer>
          <Typography
            variant="h5"
            color="secondary"
            align="center"
          >
            Welcome to Cryptocurrencies.ai
          </Typography>
        </HeaderContainer>
        <StyledTypography
            color="inherit"
            align="center"
          >
            Our entire platform is designed to help you optimize and
            maximize your portfolio. To better understand your needs, we
            would first like to ask you a few questions.
          </StyledTypography>
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
