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
`

export const sliderThumbMediaQueries = css`
  @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
    width: 2rem;
    height: 2rem;
  }
`

export const StyledSlider = styled(
  ({
    trackAfterBackground,
    trackBeforeBackground,
    trackAfterOpacity,
    thumbBackground,
    title,
    sliderWidth,
    borderRadiusAfter,
    sliderHeightAfter,
    borderRadius,
    sliderHeight,
    thumbHeight,
    thumbWidth,
    borderThumb,
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

    box-shadow: 0px 0.2rem 0.4rem rgba(8, 22, 58, 0.3);

    ${sliderThumbMediaQueries}
  }
`

export const StyledLock = styled(
  ({ value, sliderWidth, max = 100, ...rest }) => <Lock {...rest} />
)`
  color: #fff;
  position: absolute;
  z-index: 10;
  left: calc(
    ${(props) => props.value * +(parseFloat(props.sliderWidth) / props.max)}rem -
      0.75rem
  );
  height: 1.5rem;
  width: 1.5rem;
  top: 0.2rem;
`

export const AvailableRange = styled.div`
  height: 1.8rem;
  position: absolute;
  top: 0.1rem;
  left: ${(props) => props.x || 0};
  background: #abbad1;
  width: ${(props) => props.range || '17.5rem'};
  opacity: 0.5;
  border-radius: 3rem;
  z-index: 1;

  @media screen and (min-device-width: 1921px) and (min-device-height: 1081px) and (-webkit-min-device-pixel-ratio: 1) {
    height: 1.6rem;
    top: 0.2rem;
  }
`
