import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'
import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'

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

  @media (min-width: 2560px) {
    height: auto;
  }
`

export const GridItemContainer = styled(Grid)`
  /* min-height: 200px; */
  height: 85vh;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border-radius: 20px;
  border: ${(props) => props.borderColor};
`

export const ContentGrid = styled(Grid)`
  padding: 0 15px;
  margin-top: 25px;
`

export const TypographyContatinerTitle = styled(Typography)`
/* background: ${(props) => props.bgColor};
     margin-top: 10px;
     color: ${(props) => props.textColor};
     font-size: 1rem;
     text-transform: uppercase;
     letter-spacing: 1.5px;
     font-weight: 700;
     width: 100%;
     text-align: ${(props) => props.textAlign || 'center'};
     height: 24px;
     padding: ${(props) => props.textPadding};
     padding: 1rem 0;
     */
  color: ${(props) => props.textColor}; 
  background: ${(props) => props.bgColor};
  margin-top: 6px;
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
    padding: 0.4rem 0 1rem 0.8rem;
    height: auto;
  }
`

export const TransactionsTitle = styled(TypographyContatinerTitle)`
  padding: 0rem 0 1rem 2rem;

  @media (min-width: 2560px) {
    padding: 0.4rem 0 1rem 2rem;
  }
`

export const TypographyAccountTitle = styled(Typography)`
  font-family: DM Sans;
  font-size: ${(props) => props.fontSize || `1.2rem`};
  line-height: ${(props) => props.lineHeight || '35px'};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #7284a0;
  margin-left: 10px;

  @media (min-width: 2560px) {
  }
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
  padding: 0 0 10px 45px;

  @media (min-width: 2560px) {
    padding: 0 0 10px 80px;
  }
`

export const GridShowHideDataContainer = styled(Grid)`
  position: absolute;
  bottom: 0;
  min-width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
`

export const TypographyCalendarLegend = styled(Typography)`
  padding: 0 10px;
  font-size: 0.9rem;
  text-align: ${(props) => props.textAlign};
`

export const GridAccountContainer = styled(Grid)`
  height: 85vh; /* min-height: 130px; */
  border-radius: 20px;
  position: relative;
  border: ${(props) => props.borderColor};
  background: #fff;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
`

export const LessMoreContainer = styled(Grid)`
  margin-top: 5px;
  background-image: linear-gradient(90deg, #e7ecf3 0%, #165be0 100%);
  height: 12px;
  width: 90%;
  border-radius: 32px;
`

export const GridTableContainer = styled(Grid)`
  height: 51vh;
  overflow: scroll;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border-radius: 20px;
  border: ${(props) => props.borderColor};
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 2560px) {
    height: 67vh;
  }
`

export const PortfolioMainChartStyled = styled(PortfolioMainChart)`
  /* &&& {
    margin-top: 2%;
    margin-left: 0;
    max-height: 235px;
    box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  } */
`
