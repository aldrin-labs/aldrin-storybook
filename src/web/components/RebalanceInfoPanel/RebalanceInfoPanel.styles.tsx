import styled from 'styled-components'
import { Typography, Link, Grid } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const GridInfoPanelWrapper = styled(Grid)`
  margin-bottom: 10px;
  /* position: fixed; */  /*TODO STICKY MENU*/
  /* background-color: #f9fbfd;
  padding: 10px 0 7px 0;
  top: 50px;
  z-index: 1000; 
  border-top: 2px solid #e7ecf3;
  border-bottom: 2px solid #e7ecf3;
  */
`

export const CustomLink = styled(Link)`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  padding: 0 5px;
  margin-right: 3px;
  text-transform: uppercase;
  color: ${(props) => props.linkColor || 'white'};
  text-align: ${(props) => props.position || 'none'};
  align-self: ${(props) => props.verticalPosition || 'none'};
  &:hover {
    text-decoration: none;
  }
`

export const StyledTypography = styled(Typography)`
  font-size: 10px;
  line-height: 25px;
  font-weight: ${(props) => props.fontWeight || '400'};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) =>
    props.counterColor ||
    props.prymaryColor ||
    props.secondaryColor ||
    '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
`

export const StyledSubTypography = styled(Typography)`
  font-size: ${(props) => props.fontSize || `16px`};
  font-weight: ${(props) => props.fontWeight || '400'};
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) =>
    props.color ||
    props.counterColor ||
    props.secondaryColor ||
    props.primaryColor ||
    '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
`
