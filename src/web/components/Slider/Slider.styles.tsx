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
  width: ${ (props: {sliderWidth: string}) => props.sliderWidth || '100px'};
  & .trackAfter {
    background: ${(props: { trackAfterBackground: string }) =>
      props.trackAfterBackground};
    opacity: ${(props: { trackAfterOpacity: string }) =>
      props.trackAfterOpacity};
  }

  & .trackBefore {
    border-radius: ${(props: {borderRadius: string}) => props.borderRadius || 'none'};
    height: ${(props: {sliderHeight: string}) => props.sliderHeight || '2px'};
    background: ${(props: { trackBeforeBackground: string }) =>
      props.trackBeforeBackground};
    opacity: 1;
  }

  & .thumb {
    height: ${(props: {thumbHeight: string}) => props.thumbHeight || '12px'};
    width: ${(props: {thumbWidth: string}) => props.thumbWidth || '12px'};
    background: ${(props: { thumbBackground: string }) =>
      props.thumbBackground};
    // border: ${(props: {borderThumb: string}) => props.borderThumb};
  }
`
