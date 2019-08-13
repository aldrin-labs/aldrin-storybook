import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
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
  width: fit-content;
  // margin: 2rem auto 0;
  padding: 0.6rem 1.2rem;

  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  margin: ${(props) => props.btnMargin};
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

  @media (max-width: 1400px) {
    padding: 0.8rem 1.2rem;
  }

  @media (max-width: 1090px) {
    width: 70px;
  }

  @media (min-width: 1921px) {
    font-size: 0.7rem;
    border-radius: 0.5rem;
    width: auto;
    height: auto;
    max-width: 140px;
    padding: 0.6rem 2rem;
    margin: 0.2rem 0.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 0.6rem;
    margin: 0.2rem 0.5rem 0.15rem 0.5rem;
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

  @media (min-width: 1921px) {
    padding: 0 15px;
  }
`

export const GridCell = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
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

  @media (min-width: 1921px) {
    font-size: 1rem;
    padding: 0 0.75rem;
    color: #7284a0;
  }
`
export const TypographyTariff = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};

  @media (max-width: 1125px) {
    padding-left: 12px;
  }

  @media (max-width: 1400px) {
    padding-left: 5.5rem;
  }

  @media (min-width: 1921px) {
    margin-left: 0.5rem;
    padding-left: 2rem;
  }

  @media (min-width: 2100px) {
    margin-left: 3.5rem;
  }

  @media (min-width: 2300px) {
    padding-left: 4rem;
  }

  @media (min-width: 2560px) {
    margin-left: 2.5rem;
    padding-left: 2rem;
  }
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
  font-family: DM Sans;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all ease-in-out 0.5s;
  width: fit-content;
  padding: ${(props) => (props.isStats ? '0.45rem 3rem' : '0.55rem 2rem')};
  margin: ${(props) => props.btnMargin};
  width: ${(props) => props.btnWidth};
  height: ${(props) => props.btnHeight};
  background: ${(props) => props.btnBgColor};
  border-radius: ${(props) => props.btnRadius};
  font-size: ${(props) => props.btnFontSize};
  color: ${(props) => props.btnTextColor};
  border: 1px solid ${(props) => props.borderColor};
  &:hover {
    background: ${(props) => props.btnHoverColor};
    color: ${(props) => props.btnHoverTextColor};
    border: 1px solid ${(props) => props.borderColor};
  }

  @media (max-width: 1280px) {
    width: 80px;
  }

  @media (max-width: 1090px) {
    width: 70px;
  }

  @media (max-width: 1400px) {
    padding: ${(props) => (props.isStats ? '0.6rem 3.6rem' : '0.7rem 2.6rem')};
  }

  @media (min-width: 1921px) {
    font-size: 0.7rem;
    border-radius: 0.5rem;
    width: auto;
    max-width: 140px;
    height: auto;
    padding: ${(props) =>
      props.isStats && !props.isStatsOpen ? '0.5rem 3rem' : '0.5rem 2rem'};
    margin: 0.2rem 0.5rem 0.1rem 0.5rem;
  }

  @media (min-width: 2560px) {
    padding: ${(props) =>
      props.isStats && !props.isStatsOpen ? '0.5rem 2.5rem' : '0.5rem 2rem'};
    font-size: 0.6rem;
    margin: 0.2rem 0.5rem 0.15rem 0.5rem;
  }
`

export const TypographyTitle = styled(Typography)`
  font-size: 1.2rem;
  padding: ${(props) => props.padding};

  @media (min-width: 2560px) {
    font-size: 1rem;
  }
`
