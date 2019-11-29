import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

import React from 'react'
import styled from 'styled-components'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'
const Handle = Slider.Handle

const StyledSlider = styled(
  ({
    trackAfterBackground,
    trackBeforeBackground,
    sliderContainerStyles,
    ...rest
  }) => <Slider {...rest} />
)`
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

const handle = (props) => {
  const { value, valueSymbol, dragging, index, ...restProps } = props

  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={
        <span>
          {value} {valueSymbol}
        </span>
      }
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
}

const RCSlider = ({
  min,
  max,
  defaultValue,
  valueSymbol,
  value,
  onChange,
  ...rest
}) => {
  return (
    <StyledSlider
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      handle={(props) => handle({ ...props, valueSymbol })}
      {...rest}
    />
  )
}

export default RCSlider
