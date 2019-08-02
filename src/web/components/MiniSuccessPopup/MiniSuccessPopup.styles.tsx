import {
  Typography,
  Paper
} from '@material-ui/core'

import styled from 'styled-components'

export const TypographyTitle = styled(Typography)`
  color: #fff;
  font-size: 1.6rem;
  font-weight: 400;

  @media(min-width: 1921px) {
    font-size: 1.5rem;
  }

  @media(min-width: 2560px) {
    font-size: 1.4rem;
  }
`

export const StyledPaper = styled(Paper)`
  padding: 1rem 1.5rem;
  background-color: #16253D;
  border-radius: 1rem;
`
