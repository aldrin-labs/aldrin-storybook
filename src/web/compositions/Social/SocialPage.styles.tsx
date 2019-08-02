import styled from 'styled-components'
import { Grid, Typography, Input, SvgIcon } from '@material-ui/core'
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
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => props.fontSize || '0.9rem'};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#7284a0'};
  padding: ${(props) => props.paddingText};
  margin: ${(props) => props.marginText};
`
export const TypographyPercentage = styled(Typography)`
  color: ${(props) => props.textColor || '#7284a0'};
`

export const FolioValuesCell = styled(Grid)`
  height: 48px;
  width: 95px;
  text-align: center;
  background: ${(props) => props.bgColor || '#F9FBFD'};
  border: ${(props) => props.borderCell || '1px solid #E0E5EC'};
  border-radius: ${(props) => props.borderRadius || '12px'};

  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 2560px) {
    width: 31%;
    height: auto;
    padding: 0.5rem 1rem;
    border-radius: 1.5rem;
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
`

export const TableContainer = styled(Grid)`
  &&& {
    position: relative;
    width: 100%;
    height: 29vh; /* 60vh /*TODO : Left Panel Hight*/
    border: 1px solid #e0e5ec;
    box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
    overflow-y: scroll;
    /* border-radius: '14px !important'; */
    ::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 2560px) {
      height: 45vh; /* 60vh /*TODO : Left Panel Hight*/
    }
  }
`

export const StyledSvgIcon = styled(SvgIcon)`
  @media (min-width: 2560px) {
    width: 2.5rem;
  }
`
export const TypographyEmptyFolioPanel = styled(Typography)`
  font-size: 1.1rem;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
`
export const GridFolioConteiner = styled(Grid)`
  /* box-shadow: 0px 0px 8px rgba(10, 19, 43, 0.1);
  border: 1px solid #e0e5ec;
  border-radius: 23px; */
`
/*
            height: 50vh,

*/
