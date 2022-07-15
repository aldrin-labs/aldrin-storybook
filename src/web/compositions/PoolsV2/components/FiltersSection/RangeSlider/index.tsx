import React from 'react'

import { StyledSlider, StyledThumb, StyledTrack } from './index.styles'

const Thumb = (props) => <StyledThumb {...props} />

const Track = (props, state) => <StyledTrack {...props} index={state.index} />

export const Slider = ({ min, max, ...delegated }) => {
  return (
    <StyledSlider
      min={100}
      max={1000}
      defaultValue={[min, max]}
      renderTrack={Track}
      renderThumb={Thumb}
      {...delegated}
    />
  )
}
