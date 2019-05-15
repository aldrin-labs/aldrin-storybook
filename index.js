import { AppRegistry } from 'react-native'
import { getStorybookUI, configure } from '@storybook/react-native'

import './.storybook/rn-addons'

configure(() => {
  require('./src/mobile/stories')
}, module)

const StorybookUIRoot = getStorybookUI({})

AppRegistry.registerComponent('ccai', () => StorybookUIRoot)

export default StorybookUIRoot
