import React from 'react'
import { StyledSlider, StyledLock } from './Slider.styles'
import { TooltipCustom } from '@sb/components/index'
import { DarkTooltip } from '../TooltipCustom/Tooltip'

const Slider = (props: any) => (
  <div
    className="sliderContainer"
    style={{ position: 'relative', height: '1.7rem' }}
  >
    {/* <DarkTooltip
      title={props.disabledText || 'This slider is temporary locked'}
      placement="top"
      disableHoverListener={!props.disabled}
      component={ */}
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
        <DarkTooltip
          title={props.disabledText || 'This slider is temporary locked'}
        >
          <StyledLock
            value={props.value}
            sliderWidth={props.sliderWidth}
            max={props.max}
          />
        </DarkTooltip>
      )}
    </>
    {/* /> */}
  </div>
)

export default Slider
