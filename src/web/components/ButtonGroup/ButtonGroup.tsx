import React from 'react'

import { ButtonGroupProps } from '.'
import { Button } from '../Button'

export function ButtonGroup<T>(props: ButtonGroupProps<T>) {
  const {
    buttons,
    $variant = 'secondary',
    $variantSelected = 'primary',
    selected,
    onSelect,
  } = props
  return (
    <div>
      {buttons.map((button) => (
        <Button
          $variant={selected === button.key ? $variantSelected : $variant}
          key={`button_group_btn_${button.key}`}
          onClick={() => onSelect(button.key)}
        >
          {button.children}
        </Button>
      ))}
    </div>
  )
}
