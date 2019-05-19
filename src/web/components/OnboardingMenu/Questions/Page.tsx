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
    selected: 0,
  }

  select = (option: number) => {
    console.log('aaa')
    this.setState({selected: option})
  }
  render() {
    const {
      step,
      changeStep,
      changePage,
      data: { question, answers, input }
    } = this.props

    const { selected } = this.state

    console.log('selected', selected)

    return(
  <Wrapper>
    <Typography
      variant="h5"
      color="secondary"
      align="center"
    >
      Page {step}
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
          <OptionButton onCLick={() => this.select(key)} selected={selected === key}>
            {answer}
          </OptionButton>
        </Grid>
        ))
        }
        </Grid>
    </ContentContainer>
    <BottomContainer>
        <StyledBeginButton onClick={props.step === 1
          ? () => props.changePage('Welcome')
          : () => props.changeStep(props.step - 1)}>
          BACK
        </StyledBeginButton>2
        <StyledBeginButton onClick={props.step === 4
          ? () => props.changePage('ChooseExchange')
          : () => props.changeStep(props.step + 1)}>
          NEXT
        </StyledBeginButton>
    </BottomContainer>
  </Wrapper>
    )
  }
}

export default Welcome
