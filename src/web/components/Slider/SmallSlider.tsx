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

    .rc-slider {
      &-rail {
        background-color: ${(props) => props.trackAfterBackground || '#E0E5EC'};
      }

      &-track {
        background-color: ${(props) =>
          props.trackBeforeBackground || '#5C8CEA'};
      }

      &-handle {
        ${(props) => props.handleStyles}
      }

      &-dot {
        ${(props) => props.dotStyles}
      }

      &-dot-active {
        ${(props) => props.activeDotStyles}
      }

      &-mark-text {
        ${(props) => props.markTextSlyles}
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
