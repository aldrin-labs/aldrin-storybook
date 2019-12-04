import styled from 'styled-components'
import { OutlinedInput, Typography, InputAdornment } from '@material-ui/core'

export const StyledInput = styled(OutlinedInput)`
  height: 5rem;
  width: 80%;
  & input {
    font-size: 1.4rem;
    font-weight: bold;
    color: #16253d;
    text-align: center;
  }
  & fieldset {
    border-color: rgb(224, 229, 236);
    border-width: 2px;
    border-radius: 8px;
  }
`

export const StyledTypography = styled(Typography)`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: bold;
`

export const StyledTypographyCaption = styled(Typography)`
  color: rgba(65, 73, 94, 0.69);
  font-size: 0.9rem;
  font-weight: bold;
`