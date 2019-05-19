import * as React from 'react'

import { Typography, Grid } from '@material-ui/core'

import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ContentContainer,
  WelcomeTextContainer,
  BottomContainer,
  OptionButton,
} from './styles'

export class Page extends React.Component {
  state = {
    selected: -1,
  }

  render() {
    const {
      step,
      changeStep,
      changePage,
      question: { question, answers, input },
      allAnswers,
      saveAnswer,
    } = this.props

    return(
  <Wrapper>
    <Typography
      variant="h5"
      color="secondary"
      align="center"
    >
      Page {step + 1}
    </Typography>
    <ContentContainer>
      <WelcomeTextContainer>
      <StyledTypography
        color="inherit"
        align="center"
      >
        {question}
      </StyledTypography>
      </WelcomeTextContainer>
      <Grid>
        {answers.map((answer, key) => (
          <Grid item>
          <OptionButton
            onClick={() => saveAnswer({answer, key})}
            selected={allAnswers[step] && allAnswers[step].key === key}
          >
            {answer}
          </OptionButton>
        </Grid>
        ))
        }
        </Grid>
    </ContentContainer>
    <BottomContainer>
        <StyledBeginButton onClick={step === 0
          ? () => changePage('Welcome')
          : () => changeStep(step - 1)}>
          BACK
        </StyledBeginButton>
        <StyledBeginButton onClick={step === 7
          ? () => changePage('ChooseExchange')
          : () => changeStep(step + 1)}>
          NEXT
        </StyledBeginButton>
    </BottomContainer>
  </Wrapper>
    )
  }
}

export default Page
