import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { text, boolean } from '@storybook/addon-knobs/react'

import Button from '@components/Elements/Button/Button'

storiesOf('Button', module)
  .add(
    'Button',
    () => 
      <Button
        title={text('Title', 'Button')}
        active={boolean('Active', true)}
        onClick={action('clicked')}
      />
  )
