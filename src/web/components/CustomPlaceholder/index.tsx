import React from 'react'
import styled from 'styled-components'
import { Typography, Fade } from '@material-ui/core'

export default ({ show = true, text }) => (
      <Container>
        <Fade timeout={1000} in={show}>
          <Typography variant="h3" color="textPrimary">
            {text}
          </Typography>
        </Fade>
      </Container>
  )

const Container = styled.div`
  height: 100%;
  opacity: 0.5;
  width: 100%;
  display: flex;
  place-content: center;
  place-items: center;
  position: absolute;
  z-index: 1;
`
