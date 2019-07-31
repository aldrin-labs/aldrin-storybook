import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button, IconButton, DialogTitle } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'

export const ButtonShare = styled(Button)`
  background: ${props => props.active ? '#165be0' : '#FFFFFF'};
  color: ${props => props.active ? '#fff' : '#7284A0'};
  padding: 1rem 2rem;
  border: 2px solid #e0e5ec;
  box-sizing: border-box;
  border-radius: 24px;
  font-size: 1rem;

  &:hover {
    color: #fff;
    background-color: #165be0;
    border: 2px solid #165be0;
  }
`

export const ClearButton = styled(
  ({ handleClick }) => <IconButton><Clear color="error" onClick={handleClick} /></IconButton>)`
`

export const Line = styled.div`
  content: '';
  width: 100%;
  background-color: #E0E5EC;
  margin-left: 1rem;
  height: 2px;
`;

export const TypographySectionTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.16rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  color: #16253D;
`
export const TypographySubTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 31px;
  color: #7284a0;
`

export const TypographyTitle = styled(Typography)`
font-family: DM Sans;
font-style: normal;
font-weight: 600;
font-size: 1rem;
text-transform: uppercase;
line-height: 31px;
color: #7284a0;
`

export const DialogFooter = styled(DialogTitle)`
  text-align: center;
  color: #fff;
  background: #2f7619;
  border-radius: 0px 0px 20px 20px;
`
