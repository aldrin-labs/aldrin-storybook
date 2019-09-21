import React from 'react'
import styled from 'styled-components'
import { InputBase } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

export const SearchIconCustom = styled(SearchIcon)`
  color: #c4c4c4;
  width: 18px;
  height: '100%';
  position: 'absolute';
  pointer-events: 'none';
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`
export const InputBaseCustom = styled(
  ({ width, height, fontSize, borderRadius, marginLeft, ...rest }) => (
    <InputBase {...rest} />
  )
)`
  border-radius: 20px;
  margin-left: ${(props) => props.marginLeft || '12px'};
  width: ${(props) => props.width || `100%`};
  height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize};
  background: #f2f4f6;
  border-radius: ${(props) => props.borderRadius};
  padding: 4px 0 0 10px;
`
