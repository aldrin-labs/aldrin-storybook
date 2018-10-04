import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { Input } from '@components/Input/Input'

storiesOf('Input', module)
  .add(
    'Input',
    withInfo({ inline: true })(() =>
      <Input />
    )
  )
