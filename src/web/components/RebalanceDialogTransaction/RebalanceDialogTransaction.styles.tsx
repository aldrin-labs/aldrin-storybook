import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  Dialog,
  Button,
  DialogTitle,
  Typography,
  Link,
} from '@material-ui/core'

export const TypographyCustomHeading = styled(Typography)`
  font-size: 12px;
  color: ${(props) => props.color || '#000'};
  font-weight: ${(props) => props.fontWeight || `400`};
`

export const GridCustom = styled(Grid)`
  display: flex;
  justify-content: center;
  margin: 25px 0;
`
export const DialogTitleCustom = styled(DialogTitle)`
  text-align: center;
  color: #16253d;
  background: #f2f4f6;
  border-radius: 32px 32px 0px 0px;
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

export const DialogWrapper = styled(Dialog)`
  border-radius: 100px;
`

export const TypographyTopDescription = styled(Typography)`
  margin: auto;
  width: 90%;
  text-align: center;
  margin-top: 20px;
`

export const LinkCustom = styled(Link)`
  cursor: pointer;
  background: ${(props) => props.background || 'none'};
`
