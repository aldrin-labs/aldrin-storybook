import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


import {
  Wrapper,
  HeaderContainer,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
  SubHeader,
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
          Select Exchange
        </Typography>
        <SubHeader>
          <StyledTypography
              color="inherit"
              align="center"
            >
              Import your wallet to get started
            </StyledTypography>
          </SubHeader>
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
