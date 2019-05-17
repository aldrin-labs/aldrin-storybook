import React from 'react'

import { Redirect } from 'react-router-dom'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import Page5 from './Page5'
import Page6 from './Page6'
import Page7 from './Page7'
import Page8 from './Page8'

class Questions extends React.Component {
  state = {
    step: 1,
    answers: {},
  }


  changeStep = (step) => {
    this.setState({ step })
  }

  saveAnswer = (answer, step) => {
    this.setState((prevState) => ({answers: {...prevState.answers, step: answer}}))
  }

  render() {
  const {
    page,
    fullName,
    addExchangeKey,
    changePage,
    exchange,
    selectExchange,
  } = this.props

  const { step } = this.state

  console.log('step', step)

  switch(step) {
    case(1): return <Page1 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} changePage={changePage} />
    case(2): return <Page2 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(3): return <Page3 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(4): return <Page4 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(5): return <Page5 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(6): return <Page6 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(7): return <Page7 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} />
    case(8): return <Page8 step={step} changeStep={this.changeStep} saveAnswer={this.saveAnswer} changePage={changePage} />
    default: return <Redirect to="/user" />
  }
}
}

export default Questions
