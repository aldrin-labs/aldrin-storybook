import React from 'react'

import { storiesOf } from '@storybook/react'

import Button from '@components/Elements/Button/Button'

storiesOf('Button', module)
  .add(
    'Button',
    () => (
      <Button   
        title="Button"
        active={true}
        onClick={() => {}}  
      />
    )
  )
