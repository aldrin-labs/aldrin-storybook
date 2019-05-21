import * as React from 'react'

import { Typography, Grid, Input } from '@material-ui/core'

import {
  Wrapper,
  StyledTypography,
  StyledBeginButton,
  ContentContainer,
  WelcomeTextContainer,
  BottomContainer,
  OptionButton,
  StyledInput,
  InputContainer,
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

    const multi = answers && answers.length > 3

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
      <Grid container spacing={0} justify="center">
        {answers && answers.map((answer, key) => (
          <Grid item xs={multi ? 6 : 12}>
          <OptionButton
            onClick={() => saveAnswer({answer, key})}
            selected={allAnswers[step] && allAnswers[step].key === key}
          >
            {answer}
          </OptionButton>
        </Grid>
        ))
        }
        {input &&
          <Grid item>
            <InputContainer>
              <StyledInput
                onChange={(e) => saveAnswer({answer: e.target.value, key: 0})}
                value={allAnswers[step] && allAnswers[step].answer}
              />
            </InputContainer>
          </Grid>
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
          ? async () => {
            await SendResults()
            changePage('ChooseExchange')
          }
          : () => changeStep(step + 1)}>
          NEXT
        </StyledBeginButton>
    </BottomContainer>
  </Wrapper>
    )
  }
}

export default Page
