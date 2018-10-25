import React from 'react'

import { configure, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withInfo } from '@storybook/addon-info'
import { muiTheme } from 'storybook-addon-material-ui'

import { customThemes } from './customTheme'

addDecorator(
  muiTheme([customThemes.dark, customThemes.light])
)
addDecorator((story) => (
  <div style={{ margin: 20 }}>
    {story()}
  </div>
))	
addDecorator(withKnobs)


setOptions({
  name: 'Storybook',
  url: '#'
})

configure(() => require('../src/stories/index'), module)
