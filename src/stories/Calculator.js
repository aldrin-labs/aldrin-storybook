import React from 'react'

import { storiesOf } from '@storybook/react'

import Calculator from '@components/Calculator/Calculator'

storiesOf('Calculator', module)
  .add(
    'Calculator',
    () => (
      <Calculator />
    )
  )
