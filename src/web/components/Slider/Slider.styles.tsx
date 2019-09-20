import React from 'react'
import styled, { css } from 'styled-components'
import Slider from '@material-ui/lab/Slider'
import Lock from '@material-ui/icons/Lock'

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
    height: 1.5rem;
  }
  @media screen and (min-device-width: 2521px) and (min-device-height: 1481px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 2rem;
  }
`

export const sliderThumbMediaQueries = css`
  @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
    width: 2rem;
    height: 2rem;
  }

  @media screen and (min-device-width: 2521px) and (min-device-height: 1481px) and (-webkit-min-device-pixel-ratio: 1) {
    width: 3rem;
    height: 3rem;
  }
`

export const StyledSlider = styled(
  ({
    trackAfterBackground,
    trackBeforeBackground,
    trackAfterOpacity,
    thumbBackground,
    title,
    ...rest
  }) => <Slider {...rest} />
)`
  top: 1rem;
  width: ${(props: { sliderWidth: string }) => props.sliderWidth || '100px'};
  
  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //margin-top: 32px;
    margin-right: 20px;
  }
  
  & .trackAfter {
    border-top-right-radius: ${(props: { borderRadiusAfter: string }) =>
      props.borderRadiusAfter || '50px'};
      border-bottom-right-radius: ${(props: { borderRadiusAfter: string }) =>
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
    border-top-left-radius: ${(props: { borderRadius: string }) =>
      props.borderRadius || '50px'};
      border-bottom-left-radius: ${(props: { borderRadius: string }) =>
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

export const StyledLock = styled(({ value, sliderWidth, ...rest }) => (
  <Lock {...rest} />
))`
  color: #fff;
  position: absolute;
  z-index: 10;
  left: calc(${(props) =>
    props.value * +(parseFloat(props.sliderWidth) / 100)}rem - 0.75rem)};
  height: 1.5rem;
  width: 1.5rem;
  top: .2rem;
`
