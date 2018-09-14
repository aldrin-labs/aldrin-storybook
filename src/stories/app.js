import React from 'react'

import { storiesOf } from '@storybook/react'

import App from '@components/App/App'

storiesOf('Test', module)
  .add(
    'App',
    () => (
      <App />
    )
  )
