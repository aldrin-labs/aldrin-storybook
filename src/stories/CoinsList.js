import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import StoryRouter from 'storybook-react-router'
import { IntlProvider } from 'react-intl'

import {CoinsList} from '@components/CoinsList'

storiesOf('CoinsList', module)
  .addDecorator(StoryRouter())
  .add(
    'CoinsList',
    withInfo({ inline: true })(() =>
    <IntlProvider locale="en">
      <CoinsList data={["test", "test2"]}/>
    </IntlProvider>
    )
  )
