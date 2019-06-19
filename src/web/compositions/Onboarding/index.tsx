import * as React from 'react'

import { Grid } from '@material-ui/core'

import StepArrow from '@icons/StepArrow.png'

import Register from '@core/components/Register'

import Steps from './Steps'
import RegisterCallback from '@core/components/RegisterCallback'

import { MainContainerWrapper, MainContainer, ArrowGrid, Arrow } from './styles'

class Onboarding extends React.Component {
  render() {
    const { step, auth } = this.props
    return (
      <MainContainerWrapper>
        <MainContainer>
          <Grid container>
            <Steps step={step} />
            <ArrowGrid item>
              <Arrow step={step} src={StepArrow} />
            </ArrowGrid>
            {step === 'first' ? (
              <Register
                changeStep={() => this.setState({ step: 'second' })}
                auth={auth}
              />
            ) : (
              <RegisterCallback auth={auth} />
            )}
          </Grid>
        </MainContainer>
      </MainContainerWrapper>
    )
  }
}

export default Onboarding
