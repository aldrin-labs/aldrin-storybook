import styled from 'styled-components'
import { Grid, Typography, Button } from '@material-ui/core'

export const GridPageContainer = styled(Grid)`
  padding-top: 15px;
  width: 100%;
  /*max-height: 100vh;*/
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
    padding: 0 0 0.5rem 0.3rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.1rem;
  }
`

export const TypographyEditButton = styled(Button)`
  margin: 0;
  height: 70%;
  text-align: center;
  color: #7284a0;
  font-size: 1.3rem;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  color: #165be0;
  text-transform: uppercase;

  @media (min-width: 2560px) {
    height: 50%;
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
  }
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

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    width: ${(props) => (props.center ? '40%' : '30%')};
  }

  @media (max-width: 1543px) {
    width: ${(props) => (props.center ? '120px' : '85px')};
  }

  @media (max-width: 1450px) {
    width: ${(props) => (props.center ? '40%' : '30%')};
  }

  @media (min-width: 1921px) {
    width: ${(props) => (props.center ? '40%' : '30%')};
  }

  @media (min-width: 2560px) {
    width: ${(props) => (props.center ? '44%' : '31%')};
    height: auto;
    padding: 0.5rem 1rem;
    border-radius: 1.2rem;
  }
`

export const GridFolioScroll = styled(Grid)`
  padding: 0;
  height: 65vh; /*TODO : Left Panel Hight*/
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
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
