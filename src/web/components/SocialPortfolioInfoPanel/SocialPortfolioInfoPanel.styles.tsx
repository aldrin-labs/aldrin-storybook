import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button } from '@material-ui/core'

export const SpanCell = styled.span`
  color: black;
`
export const GridMainContainer = styled(Grid)`
  background: white;
  box-shadow: 0px 0px 34px -23px rgba(0, 0, 0, 0.75);
  padding: 15px;
  border-radius: 24px;
`

export const GridCell = styled(Grid)`
  border-left: ${(props) => props.border};
  text-align: center;
  font-size: 1.2rem;
  padding: 0 12px;
`

export const TypographyHeader = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`
export const TypographyTariff = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.2rem;
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
    borderColor,
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
  border: 1px solid ${(props) => props.borderColor};
  &:hover {
    background: ${(props) => props.btnHoverColor};
    color: ${(props) => props.btnHoverTextColor};
    border: 1px solid ${(props) => props.borderColor};
  }
`
//    border: 1px solid ${(props) => props.btnHoverColor || '#fff'};

export const TypographyTitle = styled(Typography)`
  font-size: 1.2rem;
`
