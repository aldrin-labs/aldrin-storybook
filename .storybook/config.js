import React from 'react'

import { configure, addDecorator } from '@storybook/react'
// import { setOptions } from '@storybook/addon-options'
import { withOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import { autoLogin } from '../src/utils/autoLogin'

import { autoLogin } from '../src/utils/autoLogin'

import { customThemes } from './customTheme'

import { GlobalStyle } from '@sb/styles/cssUtils'

import { getToken } from '@core/utils/autoLogin'
import storage from '@storage'

function loadStories() {
  // automatically import all story js files that end with *.stories.tsx
  const req = require.context('../src/web/stories', true, /.js$/)
  req.keys().forEach((filename) => req(filename))
}

addDecorator((story) => (
  <>
    <CssBaseline theme={customThemes.dark}>{story()}</CssBaseline>
    <GlobalStyle />
  </>
))

addDecorator((story) => (
  <MuiThemeProvider theme={customThemes.dark}>{story()}</MuiThemeProvider>
))
addDecorator((story) => (
  <ThemeProvider theme={customThemes.dark}>{story()}</ThemeProvider>
))
addDecorator((story) => <div style={{ margin: 20 }}>{story()}</div>)
//  addDecorator(withToken)
addDecorator(withKnobs)

addDecorator(
  withOptions({
    name: 'CCAI Storybook',
    url: '#',
  })
)

autoLogin(storage).then(() => {
  console.log('aaaaa')
  configure(loadStories, module)
})
