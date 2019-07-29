import React from 'react'

import { questions } from '@core/utils/onboardingQuestions'

import Page from './Page'

class Questions extends React.Component {
  state = {
    step: 0,
    allAnswers: {},
  }


  changeStep = (step) => {
    this.setState({ step })
  }

  saveAnswer = (answer) => {
    this.setState((prevState) => ({allAnswers: { ...prevState.allAnswers, [prevState.step]: answer }}))
  }

  SendResults = async () => {
    const { SendResultsApi } = this.props
    await SendResultsApi(this.state.allAnswers)
  }

  render() {
  const {
    page,
    fullName,
    changePage,
    SendResults,
  } = this.props

  const {
    step,
    allAnswers,
  } = this.state

  return (
    <Page
      key={step}
      page={page}
      fullName={fullName}
      changePage={changePage}
      step={step}
      changeStep={this.changeStep}
      allAnswers={allAnswers}
      saveAnswer={this.saveAnswer}
      question={questions[step]}
      SendResults={this.SendResults}
    />
    )
  }
}

export default Questions
