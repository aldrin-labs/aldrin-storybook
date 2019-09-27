import React from 'react'
import { StyledSlider, StyledLock } from './Slider.styles'
import { TooltipCustom } from '@sb/components/index'

const Slider = (props: any) => (
  <div style={{ position: 'relative', height: '1.7rem' }}>
    <TooltipCustom
      title={props.disabledText || 'This slider is temporary locked'}
      placement="top"
      disableHoverListener={!props.disabled}
      component={
        <>
          <StyledSlider
            classes={{
              trackAfter: 'trackAfter',
              trackBefore: 'trackBefore',
              thumb: 'thumb',
            }}
            {...props}
          />
          {props.disabled && (
            <StyledLock
              value={props.value}
              sliderWidth={props.sliderWidth}
              max={props.max}
            />
          )}
        </>
      }
    />
  </div>
)

export default Slider
