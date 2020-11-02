import React, { useState } from 'react'
import Tour from 'reactour'
import {
  tourConfig,
  FinishBtn,
  smartTerminal,
} from '@sb/components/ReactourOnboarding/ReactourOnboarding'

export const SmartOrderOnboarding = () => {
  const [isTourOpen, setIsTourOpen] = useState(true)
  return (
    <Tour
      showCloseButton={false}
      nextButton={<FinishBtn>Next</FinishBtn>}
      prevButton={<a />}
      showNavigationNumber={true}
      showNavigation={true}
      lastStepNextButton={<FinishBtn>Finish</FinishBtn>}
      steps={smartTerminal}
      accentColor={'#1BA492'}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
      // onRequestClose={() => {
      //   setIsTourOpen(false)
      //   localStorage.setItem('isOnboardingDone', 'true')
      // }}
    />
  )
}
