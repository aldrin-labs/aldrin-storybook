import React from 'react'

import { withTheme } from '@material-ui/styles'

import {
  SelectR,
  SelectContainer,
} from './styles'


const OvalSelector = ({theme, ...props}) => {
  return (
    <SelectContainer
      border={theme.palette.divider}
    >
      <SelectR
        {...props}
      />
    </SelectContainer>
  )
}

export default withTheme()(OvalSelector)
