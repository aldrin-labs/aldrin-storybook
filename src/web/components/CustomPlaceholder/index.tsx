import React from 'react'
import styled from 'styled-components'
import { Fade } from '@material-ui/core'

export default ({ show = true, text, containerHeight = '', theme }) => (
  <Container containerHeight={containerHeight}>
    <Fade timeout={1000} in={show}>
      <Typography theme={theme}>{text}</Typography>
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
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.grey &&
      props.theme.palette.grey.light) ||
    '#7284A0'};
  font-size: 3rem;
`
