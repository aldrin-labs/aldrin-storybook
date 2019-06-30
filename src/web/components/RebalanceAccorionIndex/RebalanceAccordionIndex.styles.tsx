import styled from 'styled-components'
import { Grid, ExpansionPanel, Typography } from '@material-ui/core'

export const GridFlex = styled(Grid)`
  display: flex;
`

export const TypographyCustom = styled(Typography)`
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

export const GridItemHeadingCustom = styled(Grid)`
  font-size: ${(props) => props.fontSize || `12px`};
  border-left: 3px solid ${(props) => props.borderColor || '#fff'};
  align-self: center;
  padding: 5px 0 5px 20px;
`

export const StyledTypography = styled(Typography)`
  font-size: ${(props) => props.fontSize || `10px`};
  font-weight: ${(props) => props.fontWeight || `500`};
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#7284A0'};
  text-align: ${(props) => props.position || 'none'};
  margin-left: ${(props) => props.marginLeft};
`

export const StyledSubTypography = styled(Typography)`
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.primaryColor || props.color || '#97c15c'};
  text-align: ${(props) => props.position || 'none'};
`
