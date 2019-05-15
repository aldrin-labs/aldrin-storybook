import React from 'react'

import { configure, addDecorator } from '@storybook/react'
// import { setOptions } from '@storybook/addon-options'
import { withOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import { customThemes } from './customTheme'

import { GlobalStyle } from '@sb/styles/cssUtils'

import { getToken } from '@core/utils/autoLogin'
import storage from '@storage'

async function login() {
  const authResult = await getToken()
  await storage.setItem('token', authResult.idToken)
}

function loadStories() {
  // automatically import all story js files that end with *.stories.tsx
  const req = require.context('../src/web/stories', true, /.js$/)
  req.keys().forEach((filename) => req(filename))
}

// export let StorybookUI = null
if (process.env.REACT_NATIVE) {
  // IF MOBILE
  // const { AppRegistry } = require('react-native');
  // const { getStorybookUI, configure } = require('@storybook/react-native');

  StorybookUI = getStorybookUI({
    port: 7007,
    host: 'localhost',
    onDeviceUI: true,
    resetStorybook: true,
  })
  AppRegistry.registerComponent('RNStorybook', () => StorybookUI)
} else {
  // IF WEB

  addDecorator((story) => (
    <>
      <CssBaseline theme={customThemes.dark}>{story()}</CssBaseline>
      <GlobalStyle />
    </>
  ))
  //You need to change customThemes.dark to customThemes.light to change theme in storybook
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
}

configure(loadStories, module)
