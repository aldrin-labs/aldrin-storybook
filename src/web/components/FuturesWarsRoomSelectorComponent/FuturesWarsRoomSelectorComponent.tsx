import React from 'react'

import OvalSelector from '@sb/components/OvalSelector'

const FuturesWarsRoomSelectorComponent = ({ ...props }: IProps) => {
  const {options, handleChange, selectStyles } = props

  return (
    <OvalSelector
      placeholder="Select room"
      options={options}
      onChange={(e) => handleChange(e)}
      selectStyles={selectStyles}
      isAccountSelect={false}
    />
  )
}

export default FuturesWarsRoomSelectorComponent
