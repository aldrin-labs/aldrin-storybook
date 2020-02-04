import React, { useState  } from 'react'
import { ILoginStep, IProps } from './SignIn.types'

const SignIn = ({ }: IProps) => {
  const [currentStep, setCurrentStep] = useState<ILoginStep>('start')

  return (
    <>
      {currentStep === 'start' && (

      )}

      {currentStep === 'addAccount' && (

      )}

    </>
  )
}

export default compose(
  withTheme,
)(Onboarding)
