import React, { CSSProperties } from 'react'
import SmallSlider from '@sb/components/Slider/SmallSlider'

const BlueSlider = ({
  value = 0,
  max = 100,
  valueSymbol = '%',
  disabled = false,
  sliderContainerStyles,
  onChange,
}: {
  value: number
  valueSymbol?: string
  disabled?: boolean
  sliderContainerStyles?: CSSProperties
  onChange: (value: number) => void
}) => {
  return (
    <SmallSlider
      defaultValue={0}
      min={0}
      max={max}
      disabled={disabled}
      value={value}
      valueSymbol={valueSymbol}
      marks={{
        0: {},
        25: {},
        50: {},
        75: {},
        100: {},
      }}
      onChange={onChange}
      sliderContainerStyles={sliderContainerStyles}
      handleStyles={{
        width: '1.2rem',
        height: '1.2rem',
        border: 'none',
        backgroundColor: '#0B1FD1',
        marginTop: '-.45rem',
        boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
      }}
      dotStyles={{
        border: 'none',
        backgroundColor: '#ABBAD1',
      }}
      activeDotStyles={{
        backgroundColor: '#5C8CEA',
      }}
      markTextSlyles={{
        color: '#7284A0;',
        fontSize: '1rem',
      }}
    />
  )
}

export default BlueSlider
