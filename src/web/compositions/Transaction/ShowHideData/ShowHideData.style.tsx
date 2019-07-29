import styled from 'styled-components'
import { Grid, Typography, FormControl } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

export const TypographyShowHide = styled(Typography)`
  font-size: 1.2rem;
  margin-right: 10px;
`
export const CheckboxShowHide = styled(Checkbox)`
  padding: 0;
`

export const GridShowDataContainer = styled(Grid)`
  width: 100%;
  border-top: 1px solid #e0e5ec;
  padding: 20px 0;
  display: flex;
  justify-content: center;
`
export const FormControlCustom = styled(FormControl)`
  border-top: 1px solid #e0e5ec;
  padding-top: 25px;
`
