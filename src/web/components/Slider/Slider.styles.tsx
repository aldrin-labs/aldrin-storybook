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
  width: ${(props: { sliderWidth: string }) => props.sliderWidth || '100px'};
  
  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    margin-top: 32px;
    margin-right: 20px;
  }
  
  & .trackAfter {
    border-radius: ${(props: { borderRadiusAfter: string }) =>
      props.borderRadiusAfter || '50px'};
    background: ${(props: { trackAfterBackground: string }) =>
      props.trackAfterBackground};
    opacity: ${(props: { trackAfterOpacity: string }) =>
      props.trackAfterOpacity};
    height: ${(props: { sliderHeightAfter: string }) =>
      props.sliderHeightAfter || '2px'};
  }

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 34px;
  }

  & .trackBefore {
    border-radius: ${(props: { borderRadius: string }) =>
      props.borderRadius || '50px'};
    height: ${(props: { sliderHeight: string }) => props.sliderHeight || '2px'};
    background: ${(props: { trackBeforeBackground: string }) =>
      props.trackBeforeBackground};
    opacity: 1;
    
   @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 34px;
    }
  }

  & .thumb {
    height: ${(props: { thumbHeight: string }) => props.thumbHeight || '12px'};
    width: ${(props: { thumbWidth: string }) => props.thumbWidth || '12px'};
    background: ${(props: { thumbBackground: string }) =>
      props.thumbBackground};
    border: ${(props: { borderThumb: string }) =>
      props.borderThumb || '0px solid white'};

    @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
      width: 48px;
      height: 48px;
    }
  }
`
