import React from 'react'
import styled from 'styled-components'
import { Fade } from '@material-ui/core'

export default ({ show = true, text, containerHeight = '' }) => (
  <Container containerHeight={containerHeight}>
    <Fade timeout={1000} in={show}>
      <Typography>{text}</Typography>
    </Fade>
  </Container>
)

const Container = styled.tr`
  height: ${({ containerHeight }: { containerHeight: string }) =>
    containerHeight};
  padding: 3.2rem;
  opacity: 0.5;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`

const Typography = styled.td`
  color: rgba(65, 73, 94, 0.69);
  font-size: 3rem;
`
