import React, { useState, useEffect } from 'react'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import HeightIcon from '@material-ui/icons/Height'
import { SliderWithPriceAndPercentageFieldRowProps } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import { Select, FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'

export const SliderWithAmountFieldRowForBasic = ({
  pair,
  theme,
  maxAmount,
  priceType,
  onAmountChange,
  onTotalChange,
  isSPOTMarket,
  onAfterSliderChange,
  quantityPrecision,
  priceForCalculate,
  onMarginChange,
  initialMargin,
  amount,
  total,
  leverage,
  isBuyType,
}: SliderWithPriceAndPercentageFieldRowProps) => {
  const [localAmount, updateLocalAmount] = useState(amount)
  const [localTotal, updateLocalTotal] = useState(total)
  const [localMargin, updateLocalMargin] = useState(initialMargin)

  useEffect(() => {
    updateLocalAmount(amount)
  }, [amount])

  useEffect(() => {
    updateLocalTotal(total)
  }, [total])

  useEffect(() => {
    updateLocalMargin(initialMargin)
  }, [initialMargin])

  return (
    <>
      <InputRowContainer
        direction="column"
        key={'amount'}
        padding={'.6rem 0'}
        justify={priceType === 'market' ? 'flex-end' : 'center'}
      >
        {isSPOTMarket ? (
          <Input
            theme={theme}
            needTitle
            title={`${isSPOTMarket ? 'amount' : 'order quantity'} (${pair[0]})`}
            value={localAmount}
            type={'text'}
            pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
            onChange={onAmountChange}
            symbol={pair[0]}
          />
        ) : (
            <InputRowContainer direction="row" padding={'0'}>
              <div style={{ width: '50%', paddingRight: '1%' }}>
                <Input
                  theme={theme}
                  needTitle
                  title={`size`}
                  value={localAmount}
                  type={'text'}
                  pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
                  onChange={onAmountChange}
                  symbol={pair[0]}
                />
              </div>
              <div style={{ width: '50%', paddingLeft: '1%' }}>
                <Input
                  theme={theme}
                  //disabled={false}
                  needTitle
                  title={`total`}
                  type={'text'}
                  value={localTotal === '' ? '' : localTotal}
                  onChange={onTotalChange}
                  symbol={pair[1]}
                />
              </div>
            </InputRowContainer>
          )}
        <InputRowContainer style={{ height: '2rem', marginTop: '.5rem' }}>
          <BlueSlider
            theme={theme}
            showMarks
            handleStyles={{ top: '0.5rem' }}
            value={
              !isSPOTMarket
                ? ((localMargin * leverage) / maxAmount) * 100
                : isBuyType
                  ? localTotal / (maxAmount / 100)
                  : localAmount / (maxAmount / 100)
            }
            sliderContainerStyles={{
              width: 'calc(100% - 1rem)',
              margin: '0 .5rem',
              padding: '.9rem 0 0 0',
            }}
            onChange={(value) => {
              const newValue = (maxAmount / 100) * value

              const newAmount =
                !isSPOTMarket || isBuyType
                  ? +stripDigitPlaces(
                    newValue / priceForCalculate,
                    isSPOTMarket ? 8 : quantityPrecision
                  )
                  : +stripDigitPlaces(
                    newValue,
                    isSPOTMarket ? 8 : quantityPrecision
                  )

              const newTotal =
                isBuyType || !isSPOTMarket
                  ? newValue
                  : newValue * priceForCalculate

              const newMargin = stripDigitPlaces(
                (maxAmount * (value / 100)) / leverage,
                2
              )

              updateLocalAmount(newAmount)
              updateLocalTotal(stripDigitPlaces(newTotal, isSPOTMarket ? 8 : 3))
              updateLocalMargin(newMargin)
            }}
            onAfterChange={onAfterSliderChange}
          />
        </InputRowContainer>
      </InputRowContainer>

      {isSPOTMarket && (
        <InputRowContainer
          key={'total'}
          padding={'0 0 .6rem 0'}
          direction={'column'}
        >
          <Input
            theme={theme}
            needTitle
            type={'text'}
            title={`total (${pair[1]})`}
            value={localTotal || ''}
            onChange={onTotalChange}
            symbol={pair[1]}
          />
        </InputRowContainer>
      )}

      {!isSPOTMarket && (
        <InputRowContainer
          key={'cost'}
          padding={'.6rem 0'}
          direction={'column'}
          justify="flex-end"
        >
          <Input
            theme={theme}
            needTitle
            //disabled={priceType === 'market'}
            title={`margin (${pair[1]})`}
            value={localMargin || ''}
            type={'text'}
            pattern={'[0-9]+.[0-9]{2}'}
            onChange={onMarginChange}
            symbol={pair[1]}
          />
        </InputRowContainer>
      )}
    </>
  )
}
