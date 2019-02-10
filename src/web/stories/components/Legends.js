import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object  } from '@storybook/addon-knobs'

import { backgrounds } from './backgrounds'
import Legends from '@components/Legends'

const legends = [
  { color: 'red', title: 'title1' },
  { color: 'green', title: 'title2' }
]
const groupId = 'GROUP-ID1'

storiesOf('Components/Legends', module)
  .addDecorator(backgrounds)
  .add(
    'Legends',
    withInfo()(() =>
      <Legends
        legends={object('legends', legends, groupId)}
        onChange={action('Changed')}
      />
  )
)
