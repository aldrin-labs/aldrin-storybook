import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  Dialog,
  Button,
  DialogTitle,
  Typography,
  Link,
  Paper,
} from '@material-ui/core'

import MuiDialogContent from '@material-ui/core/DialogContent'

export const TypographyCustomHeading = styled(
  ({ color, fontWeight, ...rest }) => <Typography {...rest} />
)`
  font-size: 1.2rem;
  color: ${(props) => props.color || '#000'};
  font-weight: ${(props) => props.fontWeight || `400`};
  text-transform: uppercase;
`

export const GridCustom = styled(Grid)`
  display: flex;
  justify-content: center;
  margin: 25px 0;
`
export const DialogTitleCustom = styled(DialogTitle)`
  text-align: center;
  text-transform: uppercase;
  color: #16253d;
  background: #f2f4f6;
  border-radius: 20px 20px 0px 0px;
`

export const DialogSubTitle = styled(DialogTitle)`
  color: #fff;
  margin: auto;
  text-align: center;
  text-transform: uppercase;
  padding: 15px 0 0 0;
  border-top: 1px solid #e7ecf3;
  border-bottom: 5px solid #cacaca;
  padding-bottom: 15px;
`

export const TypographyTopDescription = styled(({ margin, ...rest }) => (
  <Typography {...rest} />
))`
  margin: ${(props) => props.margin || '20px auto 32px auto'};
  width: 90%;
  text-align: center;
`

export const LinkCustom = styled(({ background, ...rest }) => (
  <Link {...rest} />
))`
  cursor: pointer;
  background: ${(props) => props.background || 'none'};
`

export const DialogContent = styled(MuiDialogContent)`
  margin: 0,
  padding: ${(props) => props.unit * 2}px;
`

export const RebalanceDialogTypography = styled(Typography)`
  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  line-height: 114.5%;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0b1fd1;
  margin-top: .75rem;
  cursor: pointer;
`

export const StyledPaper = styled(Paper)`
  &::-webkit-scrollbar-thumb {
    background: #165be0;
  }

  border-radius: 2rem;

  @media (min-width: 1440px) {
    min-width: 600px;
  }

  @media (min-width: 1921px) {
    min-width: 680px;
  }

  @media (min-width: 2500px) {
    min-width: 900px;
  }
`
