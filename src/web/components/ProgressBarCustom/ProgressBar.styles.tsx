import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'


export const LinearProgressCustom = styled(LinearProgress)`
  width: ${props => props.width || `100%`};
  background-color: ${(props) => props.color || '#E7ECF3'};
  border-radius: 10px;
  height: ${(props) => props.height};
`
export const GridFlex = styled(Grid)`
  display: flex;
  padding: ${(props) => props.padding};
`

export const TypographyCustom = styled(Typography)`
  font-size: 12px;
  font-weight: bold;
`




export const ChartContainer = styled(({ ...props }) => <Card {...props} />)`
  && {
    height: 100%;
    width: 100%;
  }
`