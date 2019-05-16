import * as React from 'react'

import { Typography, Link } from '@material-ui/core'


import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ButtonContainer,
  ContentContainer,
  LaunchContainer,
} from './styles'

export class Lounch extends React.Component {

  render() {
    const { name } = this.props
    return (
      <Wrapper>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
        >
          Welcome {name || ''}!
        </Typography>
        <ContentContainer>
          <LaunchContainer>
            <StyledTypography
              color="inherit"
              align="center"
            >
              Now that you have imported your wallet lets take a quick tour through the platform!
            </StyledTypography>
          </LaunchContainer>
        </ContentContainer>
        <StyledBeginButton>
          Launch my Porfolio
        </StyledBeginButton>
      </Wrapper>
    )
  }
}

export default Lounch
