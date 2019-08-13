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
  border: 1.5px solid ${(props) => props.btnColor || props.color || '#333'};
  border-radius: ${(props) => props.borderRadius || '.8rem'};
  border-width: ${(props) => props.borderWidth || '1.5px'};
  color: ${(props) => props.btnColor || props.color || '#333'};
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: 700;
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '3px 0px'};
  letter-spacing: ${props => props.letterSpacing || '1.5px'};
  background: ${props => props.backgroundColor || 'transparent'};

  &:hover {
    background: ${props => props.backgroundColor};
  }

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    padding: 0.5rem 1rem;
  }
`
