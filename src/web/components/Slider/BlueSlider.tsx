import React, { CSSProperties } from 'react'
import SmallSlider from '@sb/components/Slider/SmallSlider'
import { Theme } from '@material-ui/core'

const BlueSlider = ({
  theme,
  value = 0,
  max = 100,
  valueSymbol = '%',
  disabled = false,
  showMarks = false,
  sliderContainerStyles,
  onChange,
}: {
  theme: Theme
  max?: number
  value: number
  valueSymbol?: string
  disabled?: boolean
  showMarks?: boolean
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
      marks={
        showMarks
          ? {
              0: {},
              25: {},
              50: {},
              75: {},
              100: {},
            }
          : {}
      }
      onChange={onChange}
      sliderContainerStyles={sliderContainerStyles}
      handleStyles={{
        width: '1.2rem',
        height: '2rem',
        top: '0.2rem',
        border: 'none',
        borderRadius: '0',
        backgroundColor: theme.palette.blue.main,
        marginTop: '-.28rem',
        boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        transform: 'translate(-50%, -15%) !important',
      }}
      dotStyles={{
        border: 'none',
        backgroundColor: theme.palette.slider.dots,
      }}
      activeDotStyles={{
        backgroundColor: theme.palette.blue.main,
      }}
      markTextSlyles={{
        color: theme.palette.grey.light,
        fontSize: '1rem',
      }}
      railStyle={{
        backgroundColor: showMarks
          ? theme.palette.slider.rail
          : theme.palette.slider.dots,
      }}
      trackBeforeBackground={theme.palette.blue.main}
    />
  )
}

export default BlueSlider
