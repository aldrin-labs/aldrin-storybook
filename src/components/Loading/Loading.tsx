import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import styled from 'styled-components'

export const Loading = ({
  size = 64,
  color = purple[400],
  margin = 0,
  centerAligned = false,
}) => (
  <SpinnerContainer margin={margin} centerAligned={centerAligned}>
    <CircularProgress style={{ color }} size={size} />
  </SpinnerContainer>
)

const SpinnerContainer = styled.div`
  margin: ${(props) => (props.margin ? props.margin : '0 auto')};
  position: ${(props) => (props.centerAligned ? 'absolute' : 'static')};
  top: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
  left: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
`
