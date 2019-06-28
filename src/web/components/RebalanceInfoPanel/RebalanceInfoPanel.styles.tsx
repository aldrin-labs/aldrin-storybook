import styled from 'styled-components'
import { Typography, Button, Link } from '@material-ui/core'

export {
 StyledTypography,
 StyledSubTypography,
 CustomLink,
}

const CustomLink = styled(Link)`
  font-size: 12px;
  padding: 0 5px;
  text-transform: uppercase;
  color:${props => props.linkColor || 'white'};
  text-align: ${props => props.position || 'none'};
  align-self: ${props => props.verticalPosition || 'none'};
`

const StyledTypography = styled(Typography)`
  /* font-family: 'Aguafina Script', cursive; */
  font-size: 65%;
  /* font-size: 11px; */
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${props => props.counterColor || props.prymaryColor || props.secondaryColor ||'#7284A0'};
  text-align: ${props => props.position || 'none'};
`

const StyledSubTypography = styled(Typography)`
  font-family: 'Avenir Next';
  font-size: ${props => props.fontSize || `18px`};
  font-weight: ${props => props.fontWeight || `0`}
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${props => props.color || props.counterColor || props.secondaryColor || props.primaryColor || '#7284A0'};
  text-align: ${props => props.position || 'none'};
`
