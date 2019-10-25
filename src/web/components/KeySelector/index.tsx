import React from 'react'

import OvalSelector from '@sb/components/OvalSelector'

import { IProps, Key } from './types'

const KeySelecor = ({ ...props }: IProps) => {
  const { selectedKey, keys, selectKey, selectStyles, isAccountSelect } = props

  let suggestions: { value: string; label: string }[] = []
  if (keys) {
    suggestions = keys.map((suggestion: any) => ({
      value: suggestion,
      label: suggestion.name,
    }))
  }

  const handleChange = ({ value }: { value: Key }) => {
    if (!value) {
      return
    }
    selectKey(value)
  }

  const isEmptyValues = selectedKey.keyId === '' && selectedKey.name === ''
  const selectValue = isEmptyValues
    ? null
    : {
        value: selectedKey.keyId,
        label: selectedKey.name,
      }

  return (
    <OvalSelector
      placeholder="Select key"
      value={selectValue}
      options={suggestions}
      onChange={handleChange}
      selectStyles={selectStyles}
      isAccountSelect={isAccountSelect}
    />
  )
}

export default KeySelecor
