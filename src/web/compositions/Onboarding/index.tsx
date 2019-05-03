import * as React from 'react'

import {
  Grid,
} from '@material-ui/core'

import StepArrow from '@icons/StepArrow.png'

import Inputs from './Inputs'
import Steps from './Steps'
import Confirm from './Confirm'

import {
  MainContainer,
  ArrowGrid,
  Arrow,
} from './styles'


class Onboarding extends React.Component {
  state = {
    step: 'first',
  }

  render() {
    return (
      <MainContainer>
        <Grid container>
          <Steps step={this.state.step} />
          <ArrowGrid item>
            <Arrow step={this.state.step} src={StepArrow} />
          </ArrowGrid>
          {this.state.step === 'first'
          ? <Inputs changeStep={() => this.setState({ step: 'second' })}/>
          : <Confirm name="Antonio" />}
        </Grid>
      </MainContainer>
    )
  }
}

export default Onboarding
