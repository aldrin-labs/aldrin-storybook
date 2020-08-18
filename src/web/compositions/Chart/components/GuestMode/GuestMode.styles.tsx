import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button } from '@material-ui/core'

export const GuestModeWrapper = styled(({ ...props }) => <Grid {...props} />)`
  background: #16253d;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.8rem;

  width: 100%;
  display: flex;
  height: 37%;
  position: relative;
  overflow: hidden;
`

export const GuestModeHeading = styled(({ ...props }) => (
  <Typography {...props} />
))`
  font-weight: bold;
  font-size: 5rem;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffffff;
`

export const GuestModeSubHeading = styled(({ ...props }) => (
  <Typography {...props} />
))`
  padding-top: 2rem;
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 141.5%;
  letter-spacing: 0.015em;
  color: #f2f4f6;
`
