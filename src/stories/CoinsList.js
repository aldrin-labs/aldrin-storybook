import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import StoryRouter from 'storybook-react-router'
import { IntlProvider } from 'react-intl'
import { text, array } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import {CoinsList} from '@components/CoinsList'

storiesOf('CoinsList', module)
  .addDecorator(backgrounds)
  .addDecorator(StoryRouter())
  .add(
    'CoinsList',
    withInfo()(() =>
    <IntlProvider locale="en">
      <CoinsList data={array('data', ["test", "test2"])}/>
    </IntlProvider>
  )
)
