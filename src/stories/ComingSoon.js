import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import ComingSoon from '@components/ComingSoon'

storiesOf('ComingSoon', module)
  .add(
    'ComingSoon',
    withInfo({ inline: true })(() =>
      <ComingSoon />
    )
  )
