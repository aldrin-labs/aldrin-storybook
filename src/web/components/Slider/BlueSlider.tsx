import { Theme } from '@material-ui/core'
import React, { CSSProperties } from 'react'

import SmallSlider from '@sb/components/Slider/SmallSlider'

const BlueSlider = ({
  theme,
  value = 0,
  min = 0,
  max = 100,
  valueSymbol = '%',
  disabled = false,
  showMarks = false,
  sliderContainerStyles,
  onChange,
  onAfterChange,
}: {
  theme: Theme
  max?: number
  min?: number
  value: number
  valueSymbol?: string
  disabled?: boolean
  showMarks?: boolean
  sliderContainerStyles?: CSSProperties
  onChange: (value: number) => void
  onAfterChange?: (value: number) => void
}) => {
  return (
    <SmallSlider
      defaultValue={0}
      min={min}
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
      onAfterChange={onAfterChange}
      sliderContainerStyles={sliderContainerStyles}
      handleStyles={{
        width: '1.2rem',
        height: '1.2rem',
        border: 'none',
        backgroundColor: theme.colors.blue5,
        marginTop: '-.28rem',
        boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        transform: 'translate(-50%, -15%) !important',
      }}
      dotStyles={{
        border: 'none',
        backgroundColor: theme.colors.gray6,
      }}
      activeDotStyles={{
        backgroundColor: theme.colors.blue5,
      }}
      markTextSlyles={{
        color: theme.colors.gray1,
        fontSize: '1rem',
      }}
      railStyle={{
        backgroundColor: theme.colors.gray6,
      }}
      trackBeforeBackground={theme.palette.blue.serum}
    />
  )
}

export default BlueSlider
