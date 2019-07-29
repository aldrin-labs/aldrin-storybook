import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button } from '@material-ui/core'

export const GridCell = styled(Grid)`
  border-left: ${(props) => props.border};
  text-align: center;
  font-size: 0.75rem;
`

export const TypographyHeader = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`
export const TypographyTariff = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const ButtonCustom = styled(
  ({
    btnWidth,
    btnHeight,
    btnBorderColor,
    btnTextColor,
    btnBgColor,
    btnHoverColor,
    btnRadius,
    btnFontSize,
    btnHoverTextColor,

    ...rest
  }) => <Button {...rest} />
)`
  margin: ${(props) => props.btnMargin};
  width: ${(props) => props.btnWidth};
  height: ${(props) => props.btnHeight};
  background: ${(props) => props.btnBgColor};
  border-radius: ${(props) => props.btnRadius};
  font-family: DM Sans;
  font-weight: 700;
  font-size: ${(props) => props.btnFontSize};
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.btnTextColor};
  transition: all ease-in-out 0.5s;

  &:hover {
    background: ${(props) => props.btnHoverColor};
    color: ${(props) => props.btnHoverTextColor};
  }
`
//    border: 1px solid ${(props) => props.btnHoverColor || '#fff'};
