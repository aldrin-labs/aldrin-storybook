import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const TitleSecondRowContainer = styled.div`
  align-items: center;
  display: flex;
`

export const TitleButton = styled(({ isActive = false, secondary = '', ...rest }) => (
  <Button {...rest} />
))`
  && {
    color: ${(props: { isActive?: boolean; secondary?: string }) =>
      props.isActive ? props.secondary : ''};
    border-color: ${(props: { isActive?: boolean; secondary?: string }) =>
      props.isActive ? props.secondary : ''};
    margin: 7px;
    min-height: 30px;
    max-height: 30px;
    padding: 4px 8px;
  }
`

export const TableButton = styled(({ ...rest }) => (
  <Button {...rest} />
))`
  &&& {
    padding: 4px 8px;
    min-height: 30px;
 }
`
