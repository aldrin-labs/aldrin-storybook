import React from 'react'

import { configure, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info'
import { MuiThemeProvider } from '@material-ui/core/styles';

import { customThemes } from './customTheme'
console.log(customThemes)
//You need to change customThemes.dark to customThemes.light to change theme in storybook
addDecorator((story) => (
  <MuiThemeProvider theme={customThemes.dark}>
    {story()}
  </MuiThemeProvider>
))
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
