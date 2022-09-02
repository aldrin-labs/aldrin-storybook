import React from 'react'

import { InlineText } from '@sb/components/Typography'

import { Circle, StepContainer } from './index.styles'

const StepsCirle = ({ creationStep }: { creationStep: string }) => {
  return (
    <svg
      width="36"
      height="38"
      viewBox="0 0 36 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 3C15.0159 3 12.0843 3.7855 9.5 5.27757C6.91567 6.76963 4.76963 8.91567 3.27757 11.5C1.78551 14.0843 0.999999 17.0159 0.999998 20C0.999998 22.9841 1.7855 25.9157 3.27757 28.5"
        stroke={creationStep === 'setPreferences' ? '#00FF84' : '#302F41'}
        strokeWidth="2"
      />
      <path
        d="M32.7224 28.5C34.2145 25.9157 35 22.9841 35 20C35 17.0159 34.2145 14.0843 32.7224 11.5C31.2304 8.91567 29.0843 6.76963 26.5 5.27757C23.9157 3.78551 20.9841 3 18 3"
        stroke="#00FF84"
        strokeWidth="2"
      />
      <path
        d="M3.27757 28.5C4.76963 31.0843 6.91567 33.2304 9.5 34.7224C12.0843 36.2145 15.0159 37 18 37C20.9841 37 23.9157 36.2145 26.5 34.7224C29.0843 33.2304 31.2304 31.0843 32.7224 28.5"
        stroke={creationStep !== 'createPool' ? '#00FF84' : '#302F41'}
        strokeWidth="2"
      />
      <rect
        x="1.06689"
        y="27.5063"
        width="4.8"
        height="2.4"
        transform="rotate(-30 1.06689 27.5063)"
        fill="#212131"
      />
      <rect
        width="4.8"
        height="2.4"
        transform="matrix(-0.866025 -0.5 -0.5 0.866025 35.3569 28.4)"
        fill="#212131"
      />
      <rect
        x="19.2"
        y="0.800049"
        width="4.8"
        height="2.4"
        transform="rotate(90 19.2 0.800049)"
        fill="#212131"
      />
    </svg>
  )
}

export const StepChecker = ({ creationStep }: { creationStep: string }) => {
  const getStep = () => {
    if (creationStep === 'createPool') {
      return '1'
    }
    if (creationStep === 'setupFarming') {
      return '2'
    }
    return '3'
  }
  const currentStep = getStep()

  return (
    <Circle>
      <StepsCirle creationStep={creationStep} />
      <StepContainer>
        <InlineText color="green3" size="xsm" weight={600}>
          {currentStep}
        </InlineText>
      </StepContainer>
    </Circle>
  )
}
