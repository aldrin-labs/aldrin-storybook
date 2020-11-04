import React, { useState } from 'react'
import Tour from 'reactour'
import { finishJoyride } from '@core/utils/joyride'

import {
  tourConfig,
  FinishBtn,
  smartTerminal,
} from '@sb/components/ReactourOnboarding/ReactourOnboarding'

export const SmartOrderOnboarding = (props) => {
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
      isOpen={!props.smartTerminalOnboarding}
      onRequestClose={() => {
        finishJoyride({
          updateTooltipSettingsMutation: props.updateTooltipSettingsMutation,
          getTooltipSettings: props.getTooltipSettings,
          name: 'smartTerminal',
        })
      }}
    />
  )
}
