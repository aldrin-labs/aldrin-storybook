import * as React from 'react'

import {
  Grid,
} from '@material-ui/core'

import StepArrow from '@icons/StepArrow.png'

import Register from './Register'

import Steps from './Steps'
import LoginCallback from './LoginCallback'

import {
  MainContainer,
  ArrowGrid,
  Arrow,
} from './styles'


class Onboarding extends React.Component {

  render() {
    const { step } = this.props
    return (
      <MainContainer>
        <Grid container>
          <Steps step={step} />
          <ArrowGrid item>
            <Arrow step={step} src={StepArrow} />
          </ArrowGrid>
          {step === 'first'
          ? <Register changeStep={() => this.setState({ step: 'second' })} auth={this.props.auth}/>
          : <LoginCallback auth={this.props.auth}/>}
        </Grid>
      </MainContainer>
    )
  }
}

export default Onboarding
