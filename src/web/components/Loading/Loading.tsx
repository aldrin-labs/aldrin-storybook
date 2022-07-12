import CircularProgress from '@material-ui/core/CircularProgress'
import React, { CSSProperties } from 'react'
import styled, { useTheme } from 'styled-components'

const SpinnerContainer = styled.div`
  z-index: 10000;
  margin: ${(props) => (props.margin ? props.margin : '0 auto')};
  position: ${(props) => (props.centerAligned ? 'absolute' : 'static')};
  top: ${(props) =>
    props.centerAligned
      ? `calc(50% - ${
          props.size
            ? props.isPixelSize
              ? `${props.size}px / 2`
              : `${props.size} / 2`
            : '32px'
        }`
      : null});
  left: ${(props) =>
    props.centerAligned
      ? `calc(50% - ${
          props.size
            ? props.isPixelSize
              ? `${props.size}px / 2`
              : `${props.size} / 2`
            : '32px'
        }`
      : null});
`

export const Loading = ({
  size = 64,
  color,
  margin = 0,
  centerAligned = false,
  style,
}: {
  color?: string
  size?: number | string
  margin?: string | number
  centerAligned?: boolean
  style?: CSSProperties
}) => {
  const theme = useTheme()
  const isPixelSize = typeof size === 'number'

  return (
    <SpinnerContainer
      size={size}
      margin={margin}
      isPixelSize={isPixelSize}
      centerAligned={centerAligned}
      data-e2e="Loadig"
      style={style}
    >
      <CircularProgress style={{ color: color || '#5E55F2FF' }} size={size} />
    </SpinnerContainer>
  )
}
