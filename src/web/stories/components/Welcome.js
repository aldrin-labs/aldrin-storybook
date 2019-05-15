import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'

import Welcome from '@components/OnboardingMenu/Welcome'
import ChooseExchange from '@components/OnboardingMenu/ChooseExchange'


storiesOf('Components/OnboardingMenu', module)
  .addDecorator(backgrounds)
  .add(
    'Weclome',
    withInfo()(() =>
      <Welcome />
    )
  )
  .add(
    'ChooseExchange',
    withInfo()(() =>
      <ChooseExchange />
    )
  )