
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export {TypographyHeading, StyledTypography, StyledSubTypography, GridItemHeadingCustom }


const TypographyHeading = styled(Typography)`
`

const GridItemHeadingCustom = styled(Grid)`
    border-left:3px solid ${props => props.borderColor || '#fff'};
    align-self: center;
    padding: 5px 0 5px 20px;
`

const StyledTypography = styled(Typography)`
  font-size: 65%;
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${props => props.primaryColor || '#7284A0'};
  text-align: ${props => props.position || 'none'};
`

const StyledSubTypography = styled(Typography)`
  font-family: 'Avenir Next';
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${props => props.primaryColor ||'#97c15c'};
  text-align: ${props => props.position || 'none'};
`