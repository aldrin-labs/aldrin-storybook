import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Grid, Typography, Button } from '@material-ui/core'

export const Link = styled(
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
  }) => <NavLink {...rest} />
)`
  // width: fit-content;
  // margin: 2rem auto 0;
  // padding: 0.52rem 1.2rem;

  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
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

export const SpanCell = styled.span`
  color: black;
`
export const GridMainContainer = styled(Grid)`
  background: white;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border: 1px solid #e0e5ec;
  padding: 15px;
  border-radius: 24px;
`

export const GridCell = styled(Grid)`
  display: flex;
  justify-content: center;
  width: ${(props) => props.widthCell};
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

export const TypographyTitle = styled(Typography)`
  font-size: 1.2rem;
  padding: ${(props) => props.padding};
`
