import styled from 'styled-components'
import { Grid, Typography, FormControl } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

export const TypographyShowHide = styled(Typography)`
  width: 80%;
  white-space: nowrap;
  font-size: 1.3rem;
  margin-right: 1rem;

  @media (min-width: 1921px) {
    font-size: 1.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.25rem;
  }
`
export const CheckboxShowHide = styled(Checkbox)`
  padding: 0;

  & svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`

export const GridShowDataContainer = styled(Grid)`
  width: 100%;
  border-top: 1px solid #e0e5ec;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
`
export const FormControlCustom = styled(FormControl)`
  border-top: 0.15rem solid #e0e5ec;
  width: 100%;
`
