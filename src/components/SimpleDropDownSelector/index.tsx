import React, { Component } from 'react'
import { Select, MenuItem, InputLabel } from '@material-ui/core'

import { IProps } from '@components/SimpleDropDownSelector/index.types'

class SimpleDropDownSelector extends Component<IProps> {
  render() {
    const {
      options,
      handleChange,
      name,
      id,
      value,
      style,
      placeholder,
    } = this.props

    return (
      <>
        {placeholder ? (
          <InputLabel htmlFor="label">{placeholder}</InputLabel>
        ) : null}
        <Select
          style={style}
          value={value}
          onChange={(e) => {
            e.preventDefault()
            handleChange(e)
          }}
          inputProps={{
            name,
            id,
          }}
        >
          {options.map((option) => (
            <MenuItem
              style={{ zIndex: 1500 }}
              key={option.label}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </>
    )
  }
}

export default SimpleDropDownSelector
