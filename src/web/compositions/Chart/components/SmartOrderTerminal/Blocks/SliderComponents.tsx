import React, { useState, useEffect } from 'react'

import { SliderWithPriceFieldRowComponentProps } from '../types'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'

// component with slider + price + percentage fields
export const SliderWithPriceFieldRowComponent = ({
  pair,
  theme,
  entryPoint,
  showErrors,
  isMarketType,
  validateField,
  pricePercentage,
  approximatePrice,
  getApproximatePrice,
  onAfterSliderChange,
  onPricePercentageChange,
  onApproximatePriceChange,
}: SliderWithPriceFieldRowComponentProps) => {
  const [value, updateValue] = useState(pricePercentage)

  useEffect(() => {
    updateValue(pricePercentage)
  }, [pricePercentage])

  return (
    <>
      <Input
        theme={theme}
        padding={'0'}
        width={'calc(32.5%)'}
        textAlign={'left'}
        symbol={pair[1]}
        value={pricePercentage !== value ? getApproximatePrice(value) : approximatePrice}
        disabled={isMarketType && !entryPoint.trailing.isTrailingOn}
        showErrors={showErrors}
        isValid={validateField(true, pricePercentage)}
        inputStyles={{
          paddingLeft: '1rem',
        }}
        onChange={e => onApproximatePriceChange(e, updateValue)}
      />

      <Input
        theme={theme}
        padding={'0 .8rem 0 .8rem'}
        width={'calc(17.5%)'}
        symbol={'%'}
        preSymbol={'-'}
        textAlign={'left'}
        needPreSymbol={true}
        value={value}
        showErrors={showErrors}
        isValid={validateField(true, pricePercentage)}
        inputStyles={{
          paddingRight: '0',
          paddingLeft: '2rem',
        }}
        onChange={onPricePercentageChange}
      />

      <BlueSlider
        theme={theme}
        value={value}
        sliderContainerStyles={{
          width: '50%',
          margin: '0 .8rem 0 .8rem',
        }}
        onChange={(v) => updateValue(v)}
        onAfterChange={onAfterSliderChange}
      />
    </>
  )
}

// component for amount field