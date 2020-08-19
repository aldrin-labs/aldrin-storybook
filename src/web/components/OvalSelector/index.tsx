import React from 'react'

import { withTheme } from '@material-ui/styles'

import { SelectR, SelectContainer } from './styles'

const OvalSelector = ({ theme, selectStyles, isAccountSelect, ...props }) => {
  return (
    <SelectContainer
      theme={theme}
      selectStyles={selectStyles}
      isAccountSelect={isAccountSelect}
      border={theme.palette.divider}
    >
      <SelectR {...props} />
    </SelectContainer>
  )
}

export default withTheme()(OvalSelector)
