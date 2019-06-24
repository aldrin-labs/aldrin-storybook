import React from 'react'
import styled from 'styled-components'
import Slider from '@material-ui/lab/Slider'

export const StyledSlider = styled(
  ({
    trackAfterBackground,
    trackBeforeBackground,
    trackAfterOpacity,
    thumbBackground,
    ...rest
  }) => <Slider {...rest} />
)`
  & .trackAfter {
    background: ${(props: { trackAfterBackground: string }) =>
      props.trackAfterBackground};
    opacity: ${(props: { trackAfterOpacity: string }) =>
      props.trackAfterOpacity};
  }

  & .trackBefore {
    background: ${(props: { trackBeforeBackground: string }) =>
      props.trackBeforeBackground};
    opacity: 1;
  }

  & .thumb {
    background: ${(props: { thumbBackground: string }) =>
      props.thumbBackground};
    // border: ${(props: {borderThumb: string}) => props.borderThumb};
  }
`
