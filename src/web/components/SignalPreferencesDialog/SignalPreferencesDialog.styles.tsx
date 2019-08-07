import React from 'react'
import styled from 'styled-components'
import {
  Typography,
  Button,
  Radio,
  Checkbox,
  IconButton,
  DialogTitle,
  FormControlLabel,
  Paper,
  DialogContent,
} from '@material-ui/core'

export const StyledPaper = styled(Paper)`
  &::-webkit-scrollbar-thumb {
    background: #165be0;
  }

  border-radius: 2rem;

  @media (min-width: 1440px) {
    max-width: 450px;
  }

  @media (min-width: 1720px) {
    max-width: 500px;
  }

  @media (min-width: 1820px) {
    max-width: 540px;
  }

  @media (min-width: 1921px) {
    max-width: 680px;
  }

  @media (min-width: 2560px) {
    max-width: 850px;
  }
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  text-transform: uppercase;
  line-height: 31px;
  color: #7284a0;

  @media (min-width: 1440px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
  }
`
