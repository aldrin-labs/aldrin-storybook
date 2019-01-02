import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { object } from '@storybook/addon-knobs'

import { backgrounds } from './backgrounds'

import {AreaChart} from '@components/AreaChart'

const data = [{ x: 1, y: 2 }, { x: 2, y: 4 }]

storiesOf('AreaChart', module)
  .addDecorator(backgrounds)
  .add(
    'AreaChart',
    withInfo()(() =>
      <AreaChart data={object('data', data)} />
    )
  )