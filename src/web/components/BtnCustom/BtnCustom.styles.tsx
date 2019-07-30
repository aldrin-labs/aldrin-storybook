import React from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const BtnCustom = styled(
  ({
    btnWidth,
    height,
    btnColor,
    borderRadius,
    color,
    margin,
    padding,
    fontSize,
    ...rest
  }) => <Button {...rest} />
)`
  width: ${(props) => props.btnWidth || '218px'};
  height: ${(props) => props.height || `28px`};
  border: 1px solid ${(props) => props.btnColor || props.color || '#333'};
  border-radius: ${(props) => props.borderRadius || '8px'};
  border-width: ${(props) => props.borderWidth || '1px'};
  color: ${(props) => props.btnColor || props.color || '#333'};
  font-size: ${(props) => props.fontSize || '0.625rem'};
  font-weight: 700;
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '3px 0px'};
  letter-spacing: 1.5px;
`
