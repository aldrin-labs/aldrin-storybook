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
    backgroundColor,
    borderColor,
    hoverBackground,
    borderWidth,
    letterSpacing,
    hoverColor,
    transition,
    needMinWidth,
    style,
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
  font-family: ${props => props.fontFamily || 'Avenir Next'};
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: ${(props) => props.fontWeight || 600};
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '3px 0px'};
  letter-spacing: ${(props) => props.letterSpacing || '0.01rem'};
  background: ${(props) => props.backgroundColor || 'transparent'};
  min-width: ${(props) => !props.needMinWidth && 'auto'};
  text-transform: ${(props) => props.textTransform || 'uppercase'};
  box-shadow: ${(props) => props.boxShadow || 'none'};

  &:hover {
    color: ${(props) => props.hoverColor};
    border-color: ${(props) => props.hoverBorderColor};
    background: ${(props) => props.hoverBackground || props.backgroundColor};
    transition: ${(props) => props.transition || 'all .3s ease-out'};
  }

  ${(props) => props.style}
`
