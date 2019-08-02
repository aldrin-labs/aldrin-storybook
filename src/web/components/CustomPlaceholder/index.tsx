import React from 'react'
import styled from 'styled-components'
import { Typography, Fade } from '@material-ui/core'

export default ({ show = true, text, containerHeight = '' }) => (
  <Container containerHeight={containerHeight}>
    <Fade timeout={1000} in={show}>
      <Typography variant="h3" color="textPrimary">
        {text}
      </Typography>
    </Fade>
  </Container>
)

const Container = styled.div`
  height: ${({ containerHeight }: { containerHeight: string }) =>
    containerHeight};
  padding: 3.2rem;
  opacity: 0.5;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute; */
  z-index: 1;
`
