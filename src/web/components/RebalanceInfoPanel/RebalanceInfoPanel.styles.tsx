import styled from 'styled-components'
import { Typography, Link, Grid } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const GridInfoPanelWrapper = styled(Grid)`
  padding-bottom: 2%;
`

export const CustomLink = styled(Link)`
  font-size: 12px;
  padding: 0 5px;
  text-transform: uppercase;
  color: ${(props) => props.linkColor || 'white'};
  text-align: ${(props) => props.position || 'none'};
  align-self: ${(props) => props.verticalPosition || 'none'};
`

export const StyledTypography = styled(Typography)`
  font-size: 65%;
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
