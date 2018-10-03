import React from 'react'
import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-react-router'
import { IntlProvider } from 'react-intl'

import {CoinsList} from '@components/CoinsList'

storiesOf('CoinsList', module)
  .addDecorator(StoryRouter())
  .add(
    'CoinsList',
    () => (
    <IntlProvider locale="en">
      <CoinsList data={["test", "test2"]}/>
    </IntlProvider>
    )
  )
