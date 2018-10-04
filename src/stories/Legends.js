import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import Legends from '@components/Legends'

const legends = [
  { color: 'red', title: 'title1' },
  { color: 'green', title: 'title2' }
]

storiesOf('Legends', module)
  .add(
    'Legends',
    withInfo({ inline: true })(() => 
      <Legends 
        legends={legends}
        onChange={action('Changed')}
      />
    )
  )
