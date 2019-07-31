import React from 'react'
import styled, {css} from 'styled-components'
import { Grid, ExpansionPanel, Typography, TableCell } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const TypographyCustom = styled(({ fontWeight, ...rest }) => (
  <Typography {...rest} />
))`
  font-weight: ${(props) => props.fontWeight || '500'};
  text-transform: uppercase;
`

export const ExpansionPanelWrapper = styled(ExpansionPanel)`
  margin-bottom: 20px;
  padding: 7px 0;
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.29);

  &&:first-child {
    border-radius: 16px;
  }
  &&:last-child {
    border-radius: 16px;
  }
`

export const GridItemHeadingCustom = styled(
  ({ fontSize, borderColor, ...rest }) => <Grid {...rest} />
)`
  font-size: ${(props) => props.fontSize || `1.2rem`};
  border-left: 3px solid ${(props) => props.borderColor || '#fff'};
  align-self: center;
  padding: 5px 0 5px 20px;
`

const tphtphystylescss = css`
  font-family: 'DM Sans';
  text-align: center;
  font-size: ${(props) => props.fontSize || `1rem`};
  font-weight: ${(props) => props.fontWeight || 500};
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
  margin-left: ${(props) => props.marginLeft};
`

export const SliderTypography = styled(Typography)`
  ${tphtphystylescss}
`

export const StyledTypography = styled(
  ({
    fontSize,
    fontWeight,
    primaryColor,
    color,
    position,
    marginLeft,
    ...rest
  }) => <Typography {...rest} />
)`

  ${tphtphystylescss}

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
    margin-bottom: 1.5rem;
  }
`

export const StyledTypographyAccordionHeader = styled(
  ({ fontWeight, primaryColor, color, marginLeft, ...rest }) => (
    <Typography {...rest} />
  )
)`
  text-align: center;
  font-weight: ${(props) => props.fontWeight || `500`};
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#7284A0'};
  margin-left: ${(props) => props.marginLeft};
  text-align: left;
  font-size: 1.4rem;
  border-left: 5px solid orange;
  border-radius: 3px 0 3px 0;
  padding-left: 24px;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.8rem;
  }
`

export const StyledSubTypography = styled(
  ({ color, primaryColor, position, ...rest }) => <Typography {...rest} />
)`
  font-family: 'DM Sans';
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#97c15c'};
  text-align: ${(props) => props.position || 'none'};

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 3.2rem;
  }
`

export const TableCellLast = styled(TableCell)`
  border: none;
  padding: 0 9.5vw 0 0;
  
  @media screen and (min-device-width: 1520px) and (-webkit-min-device-pixel-ratio: 1) {
    padding: 0 10.5vw 0 0;
  }
  
  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    padding: 0 11.5vw 0 0;
  }
  
  @media screen and (min-device-width: 2500px) and (-webkit-min-device-pixel-ratio: 1) {
    padding: 0 12.3vw 0 0;
  }
`
