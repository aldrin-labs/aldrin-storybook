import React from 'react'
import styled from 'styled-components'
import DeleteIcon from '@material-ui/icons/Delete'

export const SDeleteIcon = styled(({hoverColor, ...rest}) => <DeleteIcon {...rest}/>)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`
