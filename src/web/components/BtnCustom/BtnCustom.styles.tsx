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
  width: ${(props) => props.btnWidth || '22.5rem'};
  height: ${(props) => props.height || `3rem`};
  border: 0.1rem solid
    ${(props) => props.borderColor || props.btnColor || props.color || '#333'};
  border-radius: ${(props) => props.borderRadius || '.8rem'};
  border-width: ${(props) => props.borderWidth || '.1rem'};
  border-color: ${(props) =>
    props.borderColor || props.btnColor || props.color || '#333'};
  color: ${(props) => props.btnColor || props.color || '#333'};
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: 700;
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '3px 0px'};
  letter-spacing: ${(props) => props.letterSpacing || '1.5px'};
  background: ${(props) => props.backgroundColor || 'transparent'};

  &:hover {
    background: ${(props) => props.backgroundColor};
  }
`
