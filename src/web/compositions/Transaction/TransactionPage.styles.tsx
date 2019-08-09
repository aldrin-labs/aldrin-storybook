import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
  margin-left: 1rem;

  @media (min-width: 2560px) {
    .custom-select-box__indicator {
      width: auto;
      padding-right: 1rem;
    }

    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`

export const GridContainerTitle = styled(Grid)`
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: ${(props) => props.bgColor};
  margin-bottom: .33rem;

  @media (min-width: 2560px) {
    height: auto;
  }
`

export const GridItemContainer = styled(Grid)`
  /* min-height: 200px; */
  height: 85vh;
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  border-radius: 20px;
  border: ${(props) => props.borderColor};
`

export const ContentGrid = styled(Grid)`
  padding: 0;
`

export const TypographyContatinerTitle = styled(Typography)`
/* background: ${(props) => props.bgColor};
     margin-top: 10px;
     color: ${(props) => props.textColor};
     font-size: 1.2rem;
     text-transform: uppercase;
     letter-spacing: 1.5px;
     font-weight: 700;
     width: 100%;
     text-align: ${(props) => props.textAlign || 'center'};
     height: 24px;
     padding: ${(props) => props.textPadding};
     padding: 1rem 0;
     color: #7284a0; */
  background: ${(props) => props.bgColor};
  margin-top: 10px;
  color: ${(props) => props.textColor};
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  width: 100%;
  text-align: ${(props) => props.textAlign || 'center'};
  height: 24px;
  padding: ${(props) => props.textPadding};

  @media (min-width: 2560px) {
    color: #7284a0;
    padding: 0.4rem 0 1rem 0.8rem;
    height: auto;
  }
`

export const TransactionsTitle = styled(TypographyContatinerTitle)`
  color: ${props => props.textColor || '#16253d'};
  font-size: 1.2rem;
  media(min-width: 2560px) {
    padding: 0.4rem 0 1rem 1rem;
  }
`

export const TypographyAccountTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1rem`};
  line-height: ${(props) => props.lineHeight || '3rem'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #fff;
  margin-left: 10px;

  position: relative;
  z-index: 2;
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#ABBAD1'};
  margin-left: 12px;

  @media (min-width: 2560px) {
    font-size: 1.1rem;
    margin-left: 1rem;
  }
`

export const CalendarGrid = styled(Grid)`
  padding: 0 0 1rem 4.5rem;

  @media (min-width: 2560px) {
    padding: 0 0 .5rem 4.5rem;
  }
`

export const GridShowHideDataContainer = styled(Grid)`
  position: absolute;
  bottom: 0;
  min-width: 100%;
  padding: 2rem 1.25rem;
  display: flex;
`

export const TypographyCalendarLegend = styled(Typography)`
  padding: 0 5px;
  position: relative;
  top: .5rem;
  left: 0;
  letter-spacing: 1px;
  font-size: .9rem;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  text-align: ${(props) => props.textAlign};
`

export const GridAccountContainer = styled(Grid)`
  height: 85vh; /* min-height: 130px; */
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  border-radius: 20px;
  position: relative;
  border: ${(props) => props.borderColor};
`

export const LessMoreContainer = styled(Grid)`
  margin-top: 5px;
  background-image: linear-gradient(90deg, #e7ecf3 0%, #165be0 100%);
  height: 12px;
  width: 90%;
  border-radius: 32px;
`

export const GridTableContainer = styled(Grid)`
  overflow: hidden;
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  border-radius: 20px;
  border: ${(props) => props.borderColor};
  ::-webkit-scrollbar {
    display: none;
  }
`

export const PortfolioSelectorWrapper = styled(Grid)`
  position: relative;
  padding: .75rem .5rem;
  overflow: hidden;
  min-height: 13.5rem;

  @media only screen and (min-device-width: 2256px) {
    min-height: 15rem;
  }
`
