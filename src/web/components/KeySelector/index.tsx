import React from 'react'

import OvalSelector from '@sb/components/OvalSelector'

import { IProps } from './types'

const KeySelector = ({ ...props }: IProps) => {
  const { value, options, handleChange, selectStyles, isAccountSelect } = props

  return (
    <OvalSelector
      placeholder="Select key"
      id="accountSelector"
      value={value}
      options={options}
      onChange={(e) => handleChange(e)}
      selectStyles={selectStyles}
      isAccountSelect={isAccountSelect}
      defaultMenuIsOpen={true}
    />
  )
}

export default KeySelector
