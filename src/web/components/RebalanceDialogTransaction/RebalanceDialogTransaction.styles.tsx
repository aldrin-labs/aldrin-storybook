import React from 'react'
import styled from 'styled-components'
import { Grid, Dialog, Button, DialogTitle, Typography, Link } from '@material-ui/core'

const GridCustom = styled(Grid)`
  display: flex;
  justify-content: center;
  margin: 25px 0;
`

const CancelBtn = styled(Button)`
  width: 150px;
  color: #D93B28;
  border: 2px solid #D93B28;
  border-radius: 20px;
  font-size: 11px;
  margin: 5px 10px;
`

const GoBtn = styled(Button)`
  width: 150px;
  color: #5085EC;
  border: 2px solid #5085EC;
  border-radius: 20px;
  font-size: 11px;
  margin: 5px 10px;
`

const DialogTitleCustom = styled(DialogTitle)`
  text-align: center;
  color: #16253D;
  background: #F2F4F6;
  border-radius: 32px 32px 0px 0px;
`

const DialogSubTitle = styled(DialogTitle)`
  color: #fff;
  margin: auto;
  text-align: center;
  text-transform: uppercase;
  padding: 15px 0 0 0;
  border-top: 1px solid #E7ECF3;
  /* TODO: should be bold*/
  border-bottom: 5px solid #cacaca;
  padding-bottom: 15px;
`

const DialogWrapper = styled(Dialog)`
  border-radius: 100px;
`

const TypographyTopDescription = styled(Typography)`
  margin: auto;
  width: 90%;
  text-align: center;
`

const LinkCustom = styled(Link)`
  cursor: pointer;
  background: ${props => props.background || 'none'};;
`

export { GridCustom, DialogWrapper, CancelBtn, GoBtn, DialogTitleCustom, DialogSubTitle, TypographyTopDescription, LinkCustom}