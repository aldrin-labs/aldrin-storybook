import React, { useState, useEffect } from 'react'

import {
  InputRowContainer,
  Switcher,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import HeightIcon from '@material-ui/icons/Height'
import { SliderWithPriceAndPercentageFieldRowProps } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import {
  Select,
  FormInputContainer,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'

export const SliderWithAmountFieldRow = ({
  pair,
  theme,
  side,
  amountPlotEnabled,
  maxAmount,
  showErrors,
  validateField,
  onAmountChange,
  onTotalChange,
  marketType,
  priceForCalculate,
  quantityPrecision,
  onAfterSliderChange,
  amount,
  amountPlot,
  total,
  togglePlot,
  changePlot,
}: SliderWithPriceAndPercentageFieldRowProps) => {
  const [localAmount, updateLocalAmount] = useState(amount)
  const [localTotal, updateLocalTotal] = useState(total)

  useEffect(() => {
    updateLocalAmount(amount)
  }, [amount])

  useEffect(() => {
    updateLocalTotal(total)
  }, [total])

  return (
    <>
      <InputRowContainer>
        <InputRowContainer width={'35%'} style={{ flexWrap: 'wrap' }}>
          <InputRowContainer>
            <Input
              theme={theme}
              type={'text'}
              pattern={marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
              symbol={pair[0]}
              needTitle
              title={`size`}
              value={localAmount}
              showErrors={showErrors}
              disabled={amountPlotEnabled}
              isValid={validateField(true, +amount)}
              onChange={onAmountChange}
            />
          </InputRowContainer>
          <InputRowContainer>
            <Input
              theme={theme}
              type={'text'}
              symbol={pair[1]}
              value={localTotal}
              needTitle
              title={`total`}
              disabled={amountPlotEnabled}
              onChange={onTotalChange}
            />
          </InputRowContainer>
        </InputRowContainer>
        <InputRowContainer width={'35%'}>
          <BlueSlider
            theme={theme}
            showMarks
            disabled={amountPlotEnabled}
            value={
              side === 'buy' || marketType === 1
                ? (localTotal / maxAmount) * 100
                : localAmount / (maxAmount / 100)
            }
            sliderContainerStyles={{
              width: 'calc(100% - 2.2rem)',
              margin: '0 .8rem 0 1.4rem',
            }}
            onAfterChange={onAfterSliderChange}
            // extra logic
            onChange={(value) => {
              const newValue = (maxAmount / 100) * value

              const newAmount =
                side === 'buy' || marketType === 1
                  ? newValue / priceForCalculate
                  : newValue

              const newTotal = newAmount * priceForCalculate

              updateLocalAmount(
                stripDigitPlaces(
                  newAmount,
                  marketType === 1 ? quantityPrecision : 8
                )
              )

              updateLocalTotal(stripDigitPlaces(newTotal, 3))
            }}
          />
        </InputRowContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '10%',
          }}
        >
          <Switcher checked={amountPlotEnabled} onChange={togglePlot} />
        </div>
        <Input
          theme={theme}
          type={'number'}
          textAlign="left"
          width={'calc(20% - .8rem)'}
          disabled={!amountPlotEnabled}
          value={amountPlot}
          needTitle
          title={`plot_`}
          showErrors={showErrors}
          isValid={validateField(true, amountPlot)}
          onChange={changePlot}
        />
      </InputRowContainer>
    </>
  )
}
