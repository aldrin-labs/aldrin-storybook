import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from "@storybook/addon-info"

import { ErrorFallback } from '@components/ErrorFallback'

storiesOf('ErrorFallback', module)
  .add(
    'ErrorFallback',
    () =>
      <ErrorFallback />
  )
