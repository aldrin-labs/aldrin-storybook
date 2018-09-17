import React from 'react'

import { configure, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withInfo } from '@storybook/addon-info'

addDecorator((story, context) => withInfo()(story)(context))
addDecorator(withKnobs)
addDecorator((story) => (
  <div style={{ margin: 20 }}>
    {story()}
  </div>
))

setOptions({
  name: 'Storybook',
  url: '#'
})

configure(() => require('../src/stories/index'), module)
