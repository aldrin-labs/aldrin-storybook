import React from 'react'
import styled, { css } from 'styled-components'
import Slider from '@material-ui/lab/Slider'

// const thumbWidth = '25px'
// const thumbHeight = '25px'
// const sliderWidth = '125px'
// const sliderHeight = '17px'
// const sliderHeightAfter = '20px'
// const borderRadius = '30px'
// const borderRadiusAfter = '30px'
// const thumbBackground = '#165BE0'
// const borderThumb = '2px solid white'
// const trackAfterBackground = '#E7ECF3'
// const trackBeforeBackground = '#97C15C'

export const sliderTrackMediaQueries = css`
  @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 20px;
  }
  @media screen and (min-device-width: 2521px) and (min-device-height: 1481px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 26px;
  }
`

export const sliderThumbMediaQueries = css`
  @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
    width: 24px;
    height: 24px;
  }

  @media screen and (min-device-width: 2521px) and (min-device-height: 1481px) and (-webkit-min-device-pixel-ratio: 1) {
    width: 30px;
    height: 30px;
  }
`

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
    //margin-top: 32px;
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
    
    ${sliderTrackMediaQueries}
  }

  & .trackBefore {
    border-radius: ${(props: { borderRadius: string }) =>
      props.borderRadius || '50px'};
    height: ${(props: { sliderHeight: string }) => props.sliderHeight || '2px'};
    background: ${(props: { trackBeforeBackground: string }) =>
      props.trackBeforeBackground};
    opacity: 1;
    
    ${sliderTrackMediaQueries}
  }

  & .thumb {
    height: ${(props: { thumbHeight: string }) => props.thumbHeight || '12px'};
    width: ${(props: { thumbWidth: string }) => props.thumbWidth || '12px'};
    background: ${(props: { thumbBackground: string }) =>
      props.thumbBackground};
    border: ${(props: { borderThumb: string }) =>
      props.borderThumb || '0px solid white'};

    ${sliderThumbMediaQueries}
`
