import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

interface BtnCustomProps {
  btnWidth?: string
  height?: string
  btnColor?: string
  borderRadius?: string
  margin?: string
  padding?: string
  color?: string
  fontSize?: string
  fontWeight?: string
  backgroundColor?: string
  borderColor?: string
  textTransform?: string
  hoverBackground?: string
  borderWidth?: string
  boxShadow?: string
  letterSpacing?: string
  hoverColor?: string
  style?: string
  transition?: string
  hoverBorderColor?: string
  needMinWidth?: boolean
}

const Cmp: React.FC<BtnCustomProps> = (p) => {
  const { btnWidth,
    height,
    btnColor,
    borderRadius,
    margin,
    padding,
    color,
    fontSize,
    fontWeight,
    backgroundColor,
    borderColor,
    textTransform,
    hoverBackground,
    borderWidth,
    boxShadow,
    letterSpacing,
    hoverColor,
    style,
    transition,
    hoverBorderColor,
    needMinWidth,
    ...rest
  } = p
  return <Button {...rest} />
}


export const BtnCustom = styled(Cmp) <BtnCustomProps>`
  width: ${(props: BtnCustomProps) => props.btnWidth || '22.5rem'};
  height: ${(props: BtnCustomProps) => props.height || `3rem`};
  border: 0.1rem solid
    ${(props: BtnCustomProps) => props.borderColor || props.btnColor || props.color || '#333'};
  border-radius: ${(props: BtnCustomProps) => props.borderRadius || '.8rem'};
  border-width: ${(props: BtnCustomProps) => props.borderWidth || '.1rem'};
  border-color: ${(props: BtnCustomProps) =>
    props.borderColor || props.btnColor || props.color || '#333'};
  color: ${(props: BtnCustomProps) => props.btnColor || props.color || '#333'};
  font-size: ${(props: BtnCustomProps) => props.fontSize || '1rem'};
  font-weight: ${(props: BtnCustomProps) => props.fontWeight || 700};
  margin: ${(props: BtnCustomProps) => props.margin || '0px'};
  padding: ${(props: BtnCustomProps) => props.padding || '3px 0px'};
  letter-spacing: ${(props: BtnCustomProps) => props.letterSpacing || '0.1rem'};
  background: ${(props: BtnCustomProps) => props.backgroundColor || 'transparent'};
  min-width: ${(props: BtnCustomProps) => !props.needMinWidth && 'auto'};
  text-transform: ${(props: BtnCustomProps) => props.textTransform || 'uppercase'};
  box-shadow: ${(props: BtnCustomProps) => props.boxShadow || 'none'};

  &:hover {
    color: ${(props: BtnCustomProps) => props.hoverColor};
    border-color: ${(props: BtnCustomProps) => props.hoverBorderColor};
    background: ${(props: BtnCustomProps) => props.hoverBackground || props.backgroundColor};
    transition: ${(props: BtnCustomProps) => props.transition || 'all .3s ease-out'};
  }

  ${(props: BtnCustomProps) => props.style}
`
