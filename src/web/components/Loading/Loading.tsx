import React, { CSSProperties } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

const RawLoading = ({
  size = 64,
  color,
  margin = 0,
  centerAligned = false,
  theme,
  style
}: {
  color?: string
  size?: number
  margin?: string | number
  centerAligned?: boolean
  theme?: Theme
  style?: CSSProperties
}) => (
  <SpinnerContainer
    margin={margin}
    centerAligned={centerAligned}
    data-e2e="Loadig"
    style={style}
  >
    <CircularProgress
      style={{ color: color || theme.palette.secondary.main }}
      size={size}
    />
  </SpinnerContainer>
)

export const Loading = withTheme()(RawLoading)

const SpinnerContainer = styled.div`
  z-index: 10000;
  margin: ${(props) => (props.margin ? props.margin : '0 auto')};
  position: ${(props) => (props.centerAligned ? 'absolute' : 'static')};
  top: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
  left: ${(props) => (props.centerAligned ? 'calc(50% - 32px)' : null)};
`
