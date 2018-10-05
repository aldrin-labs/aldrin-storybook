import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { createMuiTheme } from '@material-ui/core/styles'
import { muiTheme } from 'storybook-addon-material-ui';

import { customThemes } from './customTheme'
import Legends from '@components/Legends'

const legends = [
  { color: 'red', title: 'title1' },
  { color: 'green', title: 'title2' }
]

storiesOf('Legends', module)
  .addDecorator(
    muiTheme([customThemes.light, customThemes.dark]),
  )
  .add(
    'Legends',
    withInfo({ inline: true })(() => 
      <Legends
        legends={legends}
        onChange={action('Changed')}
      />
    )
  )
