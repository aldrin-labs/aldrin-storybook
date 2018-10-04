import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import Button from '@components/Elements/Button/Button'

storiesOf('Button', module)
  .add(
    'Button',
    withInfo({ inline: true })(() => 
      <Button
        title="Button"
        active={true}
        onClick={action('clicked')}
      />
    )
  )
