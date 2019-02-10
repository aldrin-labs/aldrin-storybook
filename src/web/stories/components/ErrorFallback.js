import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from './backgrounds'
import { ErrorFallback } from '@components/ErrorFallback'

storiesOf('Components/ErrorFallback', module)
  .addDecorator(backgrounds)
  .add(
    'ErrorFallback',
    withInfo()(() =>
      <ErrorFallback />
  )
)
