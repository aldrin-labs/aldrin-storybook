import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'

export const TransactionsPageMediaQuery = createGlobalStyle`
  @media only screen and (min-width: 1921px) and (max-width: 2100px) {
    html {
      font-size: 13px;
    }
  }
`

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

export const GridContainerTitle = styled(({ bgColor, ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  width: 100%;
  border-radius: 1.5rem 1.5rem 0 0;
  background: ${(props) => props.bgColor};
`

export const GridItemContainer = styled(Grid)`
  /* min-height: 200px; */
  height: 100%;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border-radius: 20px;
  border: ${(props) => props.borderColor};
`

export const GridCalendarContainer = styled(Grid)`
  height: calc(100% - 2rem);
  box-shadow: 0 0 2rem rgba(8,22,58,0.1);
  background-color: #fff;
  border: 0.1rem solid #e0e5ec;
  border-radius: 1.5rem;
`

export const ContentGrid = styled(Grid)`
  padding: 0;
`

export const TypographyContatinerTitle = styled(
  ({ bgColor, textColor, ...rest }) => <Typography {...rest} />
)`
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
  color: #16253D;
  padding: 1.2rem 0 1rem;

  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  width: 100%;
  text-align: ${(props) => props.textAlign || 'center'};
`

export const TransactionsTitle = styled(({ textColor, ...rest }) => (
  <TypographyContatinerTitle {...rest} />
))`
  color: ${(props) => props.textColor || '#16253d'};
  font-size: 1.2rem;
  media(min-width: 2560px) {
    orpadding: 0.4rem 0 1rem 1rem;
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

export const TypographyTitle = styled(({ textColor, ...rest }) => (
  <Typography {...rest} />
))`
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
    padding: 0 0 0.5rem 4.5rem;
  }
`

export const GridShowHideDataContainer = styled(Grid)`
  position: absolute;
  bottom: 0;
  min-width: 100%;
  padding: 2rem 1.5rem 2rem 1rem;
  display: flex;
  background: #fff;
`

export const TypographyCalendarLegend = styled(Typography)`
  padding: 0 5px;
  position: relative;
  top: 0.5rem;
  left: 0;
  letter-spacing: 1px;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  text-align: ${(props) => props.textAlign};
`

export const GridAccountContainer = styled(Grid)`
  height: 100%; /* min-height: 130px; */
  box-shadow: 0px 0px 0.4rem rgba(10, 19, 43, 0.1);
  border: 0.1rem solid #e0e5ec;
  background: #fff;
  border-radius: 1.5rem;
  position: relative;
`

export const LessMoreContainer = styled(Grid)`
  margin-top: 5px;
  background-image: linear-gradient(90deg, #e7ecf3 0%, #165be0 100%);
  height: 12px;
  width: 90%;
  border-radius: 32px;
`

export const GridTableContainer = styled(Grid)`
  position: relative;
  box-shadow: 0 0 2rem rgba(8,22,58,0.1);
  border-radius: 1.5rem;
  border: 0.1rem solid #e0e5ec;
  height: 67.5%;
  ::-webkit-scrollbar {
    display: none;
  }
`

export const PortfolioSelectorWrapper = styled(Grid)`
  position: relative;
  padding: 0.75rem 0.5rem;
  overflow: hidden;
  min-height: 13.5rem;

  @media only screen and (min-device-width: 2256px) {
    min-height: 15rem;
  }
`
