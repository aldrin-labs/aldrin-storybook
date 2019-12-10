import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'
const Handle = Slider.Handle

const StyledSlider = styled(({ sliderContainerStyles, ...rest }) => (
  <Slider {...rest} />
))`
  && {
    ${(props) => props.sliderContainerStyles}
    background-color: ${(props) => props.disabled && 'inherit;'};

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
        background-color: ${(props) => props.disabled && '#ABBAD1;'};
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

const TooltipStyles = createGlobalStyle`
  .rc-tooltip-inner.rc-tooltip-inner {
    background-color: ${(props) => props.trackBeforeBackground || '#5C8CEA'};
    border: .1rem solid #e0e5ec;
    min-height: auto;
    font-family: DM Sans;
    padding: .2rem .4rem;
    font-size: 1.2rem;
  }

  .rc-tooltip-arrow.rc-tooltip-arrow {
    display: none;
  }
`

const handle = (props) => {
  const { value, valueSymbol, dragging, index, ...restProps } = props
  return (
    <>
      <Tooltip
        overlay={
          <span>
            {value} {valueSymbol}
          </span>
        }
        placement="top"
        visible={dragging}
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
      <TooltipStyles trackBeforeBackground={restProps.trackBeforeBackground} />
    </>
  )
}

const RCSlider = ({
  min,
  max,
  defaultValue,
  valueSymbol,
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
    <StyledSlider
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      trackBeforeBackground={trackBeforeBackground}
      handle={(props) =>
        handle({ ...props, valueSymbol, trackBeforeBackground })
      }
      {...rest}
    />
  )
}

export default RCSlider
