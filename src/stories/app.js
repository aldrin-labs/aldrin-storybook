import React from 'react'

import { storiesOf } from '@storybook/react'

import App from '@components/App'
import SimpleDropDownSelector from '@components/SimpleDropDownSelector'

storiesOf('Test', module)
  .add(
    'App',
    () => (
      <App />
    )
  )
