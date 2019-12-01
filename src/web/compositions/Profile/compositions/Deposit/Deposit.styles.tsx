import styled from 'styled-components'
import { OutlinedInput, Typography } from '@material-ui/core'

export const StyledInput = styled(OutlinedInput)`
  height: 5rem;
  width: 80%;
  & input {
    font-size: 1.4rem;
    font-weight: bold;
    color: #16253d;
    text-align: center;
  }
`

export const StyledTypography = styled(Typography)`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: bold;
`