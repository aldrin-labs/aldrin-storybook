// Put in container that you want to be covered by coming soon
// it must have it's own heihgt and width
// because this component has Width 100% and height 100%
// also container must have position: relative
import React from 'react'
import styled from 'styled-components'
import { Typography, Fade } from '@material-ui/core'

export default ({ show = true }) =>
  show ? (
    <Container>
      <Fade timeout={1000} in={show}>
        <Typography variant="h3" color="textPrimary">
          Coming Soon
        </Typography>
      </Fade>
    </Container>
  ) : (
    <></>
  )

const Container = styled.div`
  height: 100%;
  opacity: 0.5;
  width: 100%;
  background: #83a4d4; /* fallback for old browsers */
  background: linear-gradient(to right, #83a4d4, #b6fbff);
  display: flex;
  place-content: center;
  place-items: center;
  position: absolute;
  z-index: 999;
`
