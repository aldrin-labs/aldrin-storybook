// import React from 'react'
// import styled from 'styled-components'
// import { Grid, Typography } from '@material-ui/core'

// export const SignalName = styled(Typography)`
//   font-family: DM Sans;
//   font-style: normal;
//   font-weight: 700;
//   font-size: 0.875rem;
//   letter-spacing: 0.5px;
//   text-transform: uppercase;
//   color: ${(props) => props.textColor};
// `

// export const TypographyTitle = styled(Typography)`
//   font-family: DM Sans;
//   font-style: normal;
//   font-weight: 700;
//   font-size: ${(props) => props.fontSize || '0.5625rem'};
//   letter-spacing: 1px;
//   text-transform: uppercase;
//   color: ${(props) => props.textColor || '#7284a0'};
// `
// export const TypographyPercentage = styled(Typography)`
//   color: ${(props) => props.textColor || '#7284a0'};
// `

// export const FolioValuesCell = styled(Grid)`
//   height: '48px';
//   width: '92px';
//   padding: 10px;
//   background: ${(props) => props.bgColor || '#F9FBFD'};
//   border: ${(props) => props.borderCell || '1px solid #E0E5EC'};
//   border-radius: ${props => props.borderRadius || '12px'};
// `

import styled from 'styled-components'
import { Grid, Typography, Input } from '@material-ui/core'
import ReactSelect from '@sb/components/ReactSelectComponent'

export const InputCustom = styled(Input)`
  height: 32px;
  width: 100%;
  display: flex;
  align-self: flex-start;
  margin: 0 auto 10px auto;
  padding: 5px;
  border-radius: 0px;
  background: #f9fbfd;
  border: 1px solid #e0e5ec;
`

export const GridPageContainer = styled(Grid)`
  padding-top: 15px;
  width: 100%;
  /*max-height: 100vh;*/
`

export const TypographySearchOption = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding-right: 3px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};

  @media (min-width: 2560px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
`

export const PortfolioName = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 0;
  color: ${(props) => props.textColor};

  @media (min-width: 2560px) {
    padding: 0.3rem 0 0.3rem 0.5rem;
  }
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.color};

  @media (min-width: 2560px) {
    font-size: 0.9rem;
  }
`

export const TypographySubTitle = styled(Typography)`
  padding: 0;
  margin: 0;
  color: #7284a0;
  font-size: 1.3rem;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;

  @media (min-width: 1921px) {
    font-size: 1.2rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.1rem;
    padding: 0 0 0.5rem 0.3rem;
  }
`

export const TypographyPercentage = styled(Typography)`
  color: ${(props) => props.textColor || '#7284a0'};
`

export const FolioValuesCell = styled(Grid)`
  height: 48px;
  width: ${(props) => (props.center ? '140px' : '95px')};
  text-align: center;
  background: #f9fbfd;
  border: 1px solid #e0e5ec;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 1540px) {
    width: ${(props) => (props.center ? '120px' : '85px')};
  }

  @media (min-width: 2560px) {
    width: ${(props) => (props.center ? '44%' : '31%')};
    height: auto;
    padding: 0.5rem 1rem;
    border-radius: 1.2rem;
  }
`

export const ReactSelectCustom = styled(ReactSelect)`
  font-family: DM Sans, sans-serif;
  width: 100px;
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;

  @media (min-width: 2560px) {
    font-size: 0.8rem;
  }
`
export const GridSortOption = styled(Grid)`
  height: 33px;
  padding: 0 12px;
  border-left: 1px solid #e0e5ec;
  border-right: 1px solid #e0e5ec;

  @media (min-width: 2560px) {
    height: auto;
  }
`

export const GridTableContainer = styled(Grid)`
  padding: 0 0 0 15px;
`
export const FolioCard = styled(Grid)`
  height: 140px;
  width: 93%;
  margin: 10px auto 15px auto;
  padding: 10px 12px;
  background: #fff;
  border: ${(props) => props.border};
  border-bottom: 1px solid #e0e5ec;
  box-shadow: ${(props) => props.boxShadow};
  border-radius: ${(props) => props.borderRadius};

  @media (min-width: 2560px) {
    height: auto;
  }
`
export const GridFolioScroll = styled(Grid)`
  padding: 0;
  height: 66vh; /*TODO : Left Panel Hight*/
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 2560px) {
    height: 60.3vh;
  }
`

export const TypographyEmptyFolioPanel = styled(Typography)`
  font-size: 1.1rem;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
`

export const TableContainer = styled(Grid)`
  width: 100%;
  height: 26vh; /* 60vh /*TODO : Left Panel Hight*/
  box-shadow: 0px 0px 34px -20px rgba(0, 0, 0, 0.85);
  overflow-y: scroll;
  border-radius: 22px;
  ::-webkit-scrollbar {
    display: none;
  }
`

export const GridContainerTitle = styled(Grid)`
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: ${(props) => props.bgColor};
  margin-bottom: 8px;
`

export const TypographyContatinerTitle = styled(Typography)`
  background: ${(props) => props.bgColor};
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

  @media (min-width: 2560px) {
    height: auto;
  }
`

export const ContainerGrid = styled(Grid)`
  margin: 0;
  padding: 0;
  height: 82vh;
  border-radius: 20px;
  box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);

  & > div {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
`
