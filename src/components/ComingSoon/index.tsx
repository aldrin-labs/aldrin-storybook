import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export default ({ show = true }) =>
  show ? (
    <Container>
      <Typography variant="display2" color="textPrimary">
        Coming Soon
      </Typography>
    </Container>
  ) : (
    <></>
  )

const Container = styled.div`
  height: 100%;
  opacity: 0.75;
  width: 100%;
  background: #83a4d4; /* fallback for old browsers */
  background: linear-gradient(to right, #83a4d4, #b6fbff);
  display: flex;
  place-content: center;
  place-items: center;
  position: absolute;
  z-index: 1;
`
