import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button, DialogTitle } from '@material-ui/core'

export const ButtonShare = styled(Button)`
  width: 200px;
  height: 48px;
  background: #165be0;
  color: #fff;
  border: 1px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 32px;
`

export const TypographySectionTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.5625rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #16253d;
`
export const TypographySubTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 31px;
  color: #7284a0;
`

export const DialogFooter = styled(DialogTitle)`
  text-align: center;
  color: #fff;
  background: #2f7619;
  border-radius: 0px 0px 20px 20px;
`
