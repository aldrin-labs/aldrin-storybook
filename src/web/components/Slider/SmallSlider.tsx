import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

import React from 'react'
import styled from 'styled-components'
import Slider, { createSliderWithTooltip } from 'rc-slider'
const Handle = Slider.Handle
const SliderWithTooltip = createSliderWithTooltip(Slider)

const StyledSlider = styled(({ sliderContainerStyles, ...rest }) => (
  <SliderWithTooltip {...rest} />
))`
  && {
    ${(props) => props.sliderContainerStyles}
    background-color: ${(props) => props.disabled && 'inherit;'};

    .rc-slider-tooltip-inner.rc-slider-tooltip-inner {
      background-color: ${(props) => props.trackBeforeBackground || '#5C8CEA'} !important;
      border: .1rem solid #e0e5ec;
      min-height: auto;
      font-family: DM Sans;
      padding: .2rem .4rem;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }

    .rc-slider-tooltip {
      z-index: 2070 !important;
      align-items: center;
    }
  
    .rc-slider-tooltip-arrow.rc-slider-tooltip-arrow {
      display: none;
    }

    .rc-slider {
      &-rail {
        background-color: ${(props) => props.trackAfterBackground || '#E0E5EC'};
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
      }

      &-track {
        background-color: ${(props) =>
    props.trackBeforeBackground || '#5C8CEA'};
          background-color: ${(props) => props.disabled && '#ABBAD1;'};
      }

      &-handle {
        ${(props) => props.handleStyles}
        border-radius:none;
        cursor: pointer;
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
        @media only screen and (maxWidth: 1440px): {
          top: 1.6rem,
        },
      }

      &-dot {
        ${(props) => props.dotStyles}
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
      }

      &-dot-active {
        ${(props) => props.activeDotStyles}
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
      }

      &-mark-text {
        ${(props) => props.markTextSlyles}
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
      }
    }
  }
`

const handle = (props) => {
  const { value, valueSymbol, dragging, index, ...restProps } = props
  return (
    <>
      <Handle
        style={{
          borderRadius: 'none',
          width: '0.8rem',
          top: '0.2rem',
          height: '2rem',
          cursor: 'pointer'
        }}
        value={value}
        {...restProps}
      />
    </>
  )
}

const RCSlider = ({
  min,
  max,
  defaultValue,
  valueSymbol = '%',
  value,
  onChange,
  trackBeforeBackground,
  ...rest
}: {
  min: number
  max: number
  defaultValue?: number
  valueSymbol: string
  value: number
  onChange: any
  trackBeforeBackground?: string
}) => {
  return (
    <>
      <StyledSlider
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        trackBeforeBackground={trackBeforeBackground}
        tipFormatter={v => `${v} ${valueSymbol}`}
        handle={(props) =>
          handle({ ...props, valueSymbol, trackBeforeBackground })
        }
        {...rest}
      />
    </>
  )
}

export default RCSlider
