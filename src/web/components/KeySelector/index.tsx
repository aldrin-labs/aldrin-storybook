import React from 'react'

import OvalSelector from '@sb/components/OvalSelector'

import { IProps, Key } from './types'

const KeySelecor = ({...props}: IProps) => {

  const {
    selectedKey,
    keys,
    selectKey,
  } = props

  let suggestions: [Key] = []
  if (keys) {
    suggestions = keys
      .map((suggestion: any) => ({
        value: suggestion,
        label: suggestion.name,
      }))
  }

  const handleChange = ({ value }: {value: Key}) => {
    if (!value) {
      return
    }
    selectKey(value)
  }

  return (
      <OvalSelector
      placeholder="Select key"
      value={{
        value: selectedKey.keyId,
        label: selectedKey.name,
      }}
      options={suggestions}
      onChange={handleChange}
    />
  )
}

export default KeySelecor
