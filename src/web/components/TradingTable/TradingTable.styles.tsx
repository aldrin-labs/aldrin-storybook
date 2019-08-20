import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const TitleSecondRowContainer = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  background-color: #f9fbfd;
  padding: 0.2rem auto;
  border-bottom: 1px solid #e0e5ec;
`

export const TitleButton = styled(
  ({ isActive = false, secondary = '', ...rest }) => <Button {...rest} />
)`
  font-size: 0.9rem;
  color: ${(props: { isActive?: boolean }) =>
    props.isActive ? '#fff' : '#7284A0'};
  border-color: ${(props: { isActive?: boolean }) =>
    props.isActive ? '#165BE0' : '#E0E5EC'};
  background-color: ${(props: { isActive?: boolean }) =>
    props.isActive ? '#165BE0' : '#F9FBFD'};
  margin: 7px;
  padding: 0px 8px;
  border-radius: 1rem;
  min-width: 40px;
`

export const TableButton = styled(({ ...rest }) => <Button {...rest} />)`
  &&& {
    font-size: ${CSS_CONFIG.chart.content.fontSize};
    padding: 4px 8px;
  }
`

export const ClearButton = styled(TitleButton)`
  position: absolute;
  top: -2px;
  right: 1rem;
  color: #165be0;
  border-color: #165be0;
  font-size: 1.1rem;
  min-width: 70px;
  font-weight: bold;
  border-radius: 4px;
`
