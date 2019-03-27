import React from 'react'
import styled from 'styled-components'
import { Button, Tab } from '@material-ui/core'

export const TitleSecondRowContainer = styled.div`
  align-items: center;
  display: flex;
`

export const TitleButton = styled(({ isActive, secondary, ...rest }) => (
  <Button {...rest} />
))`
  && {
    color: ${(props: { isActive: boolean; secondary: string }) =>
      props.isActive ? props.secondary : ''};
    border-color: ${(props: { isActive: boolean; secondary: string }) =>
      props.isActive ? props.secondary : ''};
    margin: 7px;
    max-height: 30px;
  }
`

export const TitleTab = styled(({ selected, primary, ...rest }) => (
  <Tab selected={selected} {...rest} />
))`
  &&& {
    color: ${(props: { selected: boolean, primary: string }) => props.selected ? props.primary : ''}
 }
`
