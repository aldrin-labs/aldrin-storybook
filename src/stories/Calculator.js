import React from 'react'

import { storiesOf } from '@storybook/react'

import Calculator from '@components/Calculator/Calculator'

const data = [
  {
      name: Name,
      rate: 1
  },
  {
      name: Name2,
      rate: 2
  }
]

storiesOf('Calculator', module)
  .add(
    'Calculator',
    () => (
      <Calculator rates={data} />
    )
  )
