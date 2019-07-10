import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  ExpansionPanelSummary,
} from '@material-ui/core'

export const LinearProgressCustom = styled(LinearProgress)`
  width: ${(props) => props.width || `100%`};
  background-color: ${(props) => props.color || '#E7ECF3'};
  border-radius: 10px;
  height: ${(props) => props.height};
`
export const GridFlex = styled(Grid)`
  display: flex;

  padding: ${(props) => props.padding};
`

export const IconCircle = styled.i`
  font-family: 11px;
  padding-right: 5px;
  color: red;
`

export const TypographyCustom = styled(Typography)`
  font-size: 12px;
  font-weight: 700;
  margin: auto;
  text-transform: uppercase;
`

export const ExpansionPanelSummaryCustom = styled(ExpansionPanelSummary)`
  '&:last-child': {
    padding-right: 0px;
  }
`
