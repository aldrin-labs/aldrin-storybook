import React from 'react'
import styled from 'styled-components'
import { Grid, Dialog, DialogTitle, Typography, Link } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'

export const TypographyCustomHeading = styled(Typography)`
  color: ${(props) => props.color || '#000'};
  font-weight: ${(props) => props.fontWeight || `400`};
`

export const GridCustom = styled(Grid)`
  padding: 15px;
`
export const GridSearchPanel = styled(Grid)`
  padding: 0 0 20px 0;
  border-bottom: 1px solid #333;
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

export const InputBaseCustom = styled(InputBase)`
  width: 100%;
  background: #f2f4f6;
  /* border: 1px solid #333; */
  border-radius: 50px;
  padding: 4px 10px;
`

export const DialogWrapper = styled(Dialog)`
  border-radius: 100px;
`

export const TypographyTopDescription = styled(Typography)`
  margin: auto;
  width: 90%;
  text-align: center;
`

export const LinkCustom = styled(Link)`
  cursor: pointer;
  background: ${(props) => props.background || 'none'};
  color: ${(props) => props.color || 'none'};
`
