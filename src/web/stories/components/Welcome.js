import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'

import Welcome from '@components/OnboardingMenu/Welcome'
import ChooseExchange from '@components/OnboardingMenu/ChooseExchange'
import ImportKey from '@components/OnboardingMenu/ImportKey'
import ImportHelp from '@components/OnboardingMenu/ImportHelp'
import Launch from '@components/OnboardingMenu/Launch'


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
  .add(
    'ImportKey',
    withInfo()(() =>
      <ImportKey />
    )
  )
  .add(
    'ImportHelp',
    withInfo()(() =>
      <ImportHelp />
    )
  )
  .add(
    'Launch',
    withInfo()(() =>
      <Launch />
    )
  )