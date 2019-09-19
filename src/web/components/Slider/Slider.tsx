import React from 'react'
import { StyledSlider } from './Slider.styles'

const Slider = (props: any) => (
    <StyledSlider
      classes={{
        trackAfter: 'trackAfter',
        trackBefore: 'trackBefore',
        thumb: 'thumb',
      }}
      {...props}
    />
)

export default Slider
