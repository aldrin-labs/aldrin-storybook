import React from 'react'

import { storiesOf } from '@storybook/react'

import App from '@components/App'

storiesOf('Test', module)
  .add(
    'App',
    () => (
      <App />
    )
  )
