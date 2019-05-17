import * as React from 'react'

import { Typography } from '@material-ui/core'


import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ContentContainer,
  WelcomeTextContainer,
  BottomContainer,
} from './styles'

export const Welcome = (props) => (
  <Wrapper>
    <Typography
      variant="h5"
      color="secondary"
      align="center"
    >
      Page {props.step}
    </Typography>
    <ContentContainer>
      <WelcomeTextContainer>
      <StyledTypography
        color="inherit"
        align="center"
      >
        {props.question}
      </StyledTypography>
      </WelcomeTextContainer>
      { props.children }
    </ContentContainer>
    <BottomContainer>
        <StyledBeginButton onClick={props.step === 1
          ? () => props.changePage('Welcome')
          : () => props.changeStep(props.step - 1)}>
          BACK
        </StyledBeginButton>
        <StyledBeginButton onClick={props.step === 4
          ? () => props.changePage('ChooseExchange')
          : () => props.changeStep(props.step + 1)}>
          NEXT
        </StyledBeginButton>
    </BottomContainer>
  </Wrapper>
)

export default Welcome
