import React, { useState, useEffect } from 'react'

import { InputRowContainer } from '../styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import HeightIcon from '@material-ui/icons/Height'
import { SliderWithPriceAndPercentageFieldRowProps } from '../types'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import { Select, FormInputContainer } from '../InputComponents'
import { getMarks } from '@core/utils/chartPageUtils'
import SmallSlider from '@sb/components/Slider/SmallSlider'

// component with slider + price + percentage fields
export const SliderWithPriceAndPercentageFieldRow = ({
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
  percentagePreSymbol,
  percentageTextAlign = 'left',
  needPriceField = true,
  sliderInTheBottom = false,
  onPricePercentageChange,
  onApproximatePriceChange,
}: SliderWithPriceAndPercentageFieldRowProps) => {
  const [value, updateValue] = useState(pricePercentage)

  useEffect(() => {
    updateValue(pricePercentage)
  }, [pricePercentage])

  return (
    <>
      {needPriceField && (
        <Input
          theme={theme}
          padding={'0'}
          width={sliderInTheBottom ? '65%' : 'calc(32.5%)'}
          textAlign={'left'}
          symbol={pair[1]}
          value={
            pricePercentage !== value
              ? getApproximatePrice(value)
              : approximatePrice
          }
          disabled={isMarketType && !entryPoint.trailing.isTrailingOn}
          showErrors={showErrors}
          isValid={validateField(true, pricePercentage)}
          inputStyles={{
            paddingLeft: '1rem',
          }}
          onChange={(e) => onApproximatePriceChange(e, updateValue)}
        />
      )}

      <Input
        theme={theme}
        padding={
          sliderInTheBottom
            ? '0 0 0 .8rem'
            : needPriceField
              ? '0 .8rem 0 .8rem'
              : '0 .8rem 0 0rem'
        }
        width={
          sliderInTheBottom ? '35%' : needPriceField ? 'calc(17.5%)' : '50%'
        }
        symbol={'%'}
        preSymbol={percentagePreSymbol}
        textAlign={percentageTextAlign}
        needPreSymbol={true}
        value={value}
        showErrors={showErrors}
        isValid={validateField(true, pricePercentage)}
        inputStyles={
          percentageTextAlign === 'left'
            ? {
              paddingRight: '0',
              paddingLeft: '2rem',
            }
            : {
              paddingLeft: '0',
              paddingRight: '4rem',
            }
        }
        onChange={onPricePercentageChange}
      />
      {!sliderInTheBottom ? (
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
      ) : (
          <InputRowContainer padding={'1.6rem 0 .8rem 0'}>
            <BlueSlider
              theme={theme}
              value={value}
              sliderContainerStyles={{
                width: sliderInTheBottom ? '100%' : '50%',
                margin: '0 .4rem 0 0rem',
              }}
              onChange={(v) => updateValue(v)}
              onAfterChange={onAfterSliderChange}
            />
          </InputRowContainer>
        )}
    </>
  )
}

// component with slider + price + percentage fields
export const SliderWithTimeoutFieldRow = ({
  theme,
  showErrors,
  validateField,
  timeoutMode,
  timeoutValue,
  onAfterSliderChange,
  onTimeoutChange,
  onChangeTimeoutMode,
}: SliderWithPriceAndPercentageFieldRowProps) => {
  const [value, updateValue] = useState(timeoutValue)

  useEffect(() => {
    updateValue(timeoutValue)
  }, [timeoutValue])

  return (
    <>
      <Input
        theme={theme}
        haveSelector
        width={'calc(75% - .4rem)'}
        showErrors={showErrors}
        isValid={validateField(true, timeoutValue)}
        value={value}
        onChange={onTimeoutChange}
        inputStyles={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      <Select
        theme={theme}
        width={'calc(25% - .8rem)'}
        value={timeoutMode}
        inputStyles={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onChange={onChangeTimeoutMode}
      >
        <option>sec</option>
        <option>min</option>
      </Select>
      <InputRowContainer padding={'1.6rem 0 .8rem 0'}>
        <BlueSlider
          theme={theme}
          max={60}
          value={value}
          sliderContainerStyles={{
            width: 'calc(100% - 1.2rem)',
            margin: '0 1.2rem 0 0rem',
          }}
          onChange={(v) => updateValue(v)}
          onAfterChange={onAfterSliderChange}
        />
      </InputRowContainer>
    </>
  )
}

// component for amount field
export const SliderWithAmountFieldRow = ({
  pair,
  theme,
  maxAmount,
  entryPoint,
  showErrors,
  setMaxAmount,
  isMarketType,
  validateField,
  onAmountChange,
  onTotalChange,
  marketType,
  priceForCalculate,
  quantityPrecision,
  onAfterSliderChange,
  onMarginChange,
  initialMargin,
  funds,
  amount,
  total,
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
      <InputRowContainer>
        <div
          style={{
            width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
          }}
        >
          <FormInputContainer
            theme={theme}
            needLine={false}
            needRightValue={true}
            rightValue={`${entryPoint.order.side === 'buy' || marketType === 1
                ? stripDigitPlaces(
                  maxAmount / priceForCalculate,
                  marketType === 1 ? quantityPrecision : 8
                )
                : stripDigitPlaces(
                  maxAmount,
                  marketType === 1 ? quantityPrecision : 8
                )
              } ${pair[0]}`}
            onValueClick={setMaxAmount}
            title={`${marketType === 1 ? 'order quantity' : 'amount'} (${pair[0]
              })`}
          >
            <Input
              theme={theme}
              type={'text'}
              pattern={marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
              symbol={pair[0]}
              value={localAmount}
              showErrors={showErrors}
              disabled={
                entryPoint.TVAlert.amountPlotEnabled &&
                entryPoint.TVAlert.plotEnabled
              }
              isValid={validateField(true, +entryPoint.order.amount)}
              onChange={onAmountChange}
            />
          </FormInputContainer>
        </div>
        <div
          style={{
            width: '6%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <HeightIcon
            style={{
              color: theme.palette.grey.text,
              transform: 'rotate(-90deg) translateX(-30%)',
            }}
          />
        </div>
        <div
          style={{
            width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
          }}
        >
          <FormInputContainer
            theme={theme}
            needLine={false}
            needRightValue={true}
            rightValue={`${entryPoint.order.side === 'buy' || marketType === 1
                ? stripDigitPlaces(maxAmount, marketType === 1 ? 0 : 2)
                : stripDigitPlaces(
                  maxAmount * priceForCalculate,
                  marketType === 1 ? 0 : 2
                )
              } ${pair[1]}`}
            onValueClick={setMaxAmount}
            title={`total (${pair[1]})`}
          >
            <Input
              theme={theme}
              symbol={pair[1]}
              value={localTotal}
              disabled={
                entryPoint.trailing.isTrailingOn ||
                isMarketType ||
                (entryPoint.TVAlert.amountPlotEnabled &&
                  entryPoint.TVAlert.plotEnabled)
              }
              onChange={onTotalChange}
            />
          </FormInputContainer>
        </div>
        {/* plot */}
        {/* {entryPoint.TVAlert.plotEnabled && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '10%',
                }}
              >
                <Switcher
                  checked={entryPoint.TVAlert.amountPlotEnabled}
                  onChange={() => {
                    updateSubBlockValue(
                      'entryPoint',
                      'TVAlert',
                      'amountPlotEnabled',
                      !entryPoint.TVAlert.amountPlotEnabled
                    )
                  }}
                />
              </div>
              <Input
                theme={theme}
                type={'number'}
                needTitle
                title={`plot_`}
                textAlign="left"
                width={'calc(20% - .8rem)'}
                inputStyles={{
                  paddingLeft: '4rem',
                }}
                disabled={!entryPoint.TVAlert.amountPlotEnabled}
                value={entryPoint.TVAlert.amountPlot}
                showErrors={showErrors}
                isValid={validateField(true, entryPoint.TVAlert.amountPlot)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSubBlockValue(
                    'entryPoint',
                    'TVAlert',
                    'amountPlot',
                    e.target.value
                  )
                }}
              />
            </>
          )} */}
      </InputRowContainer>

      <InputRowContainer>
        <BlueSlider
          theme={theme}
          showMarks
          value={
            entryPoint.order.side === 'buy' || marketType === 1
              ? (localTotal / maxAmount) * 100
              : localAmount / (maxAmount / 100)
          }
          sliderContainerStyles={{
            width: 'calc(100% - .8rem)',
            margin: '0 .8rem 0 auto',
          }}
          onAfterChange={onAfterSliderChange}
          // extra logic
          onChange={(value) => {
            const newValue = (maxAmount / 100) * value

            const newAmount =
              entryPoint.order.side === 'buy' || marketType === 1
                ? newValue / priceForCalculate
                : newValue

            const newTotal = newAmount * priceForCalculate

            const newMargin = stripDigitPlaces(
              (newTotal || 0) / entryPoint.order.leverage,
              2
            )

            updateLocalAmount(
              stripDigitPlaces(
                newAmount,
                marketType === 1 ? quantityPrecision : 8
              )
            )

            updateLocalTotal(
              stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
            )

            updateLocalMargin(newMargin)
          }}
        />
      </InputRowContainer>

      {marketType === 1 && (
        <InputRowContainer padding={'.8rem 0 0 0'}>
          <FormInputContainer
            theme={theme}
            needLine={false}
            needRightValue={true}
            rightValue={`${stripDigitPlaces(funds[1].quantity, 2)} ${pair[1]}`}
            onValueClick={setMaxAmount}
            title={`cost / initial margin (${pair[1]})`}
          >
            <Input
              theme={theme}
              symbol={pair[1]}
              value={localMargin}
              disabled={entryPoint.trailing.isTrailingOn || isMarketType}
              onChange={onMarginChange}
            />
          </FormInputContainer>
        </InputRowContainer>
      )}
    </>
  )
}

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
        <InputRowContainer style={{ height: '2rem', marginTop: '1rem' }}>
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
          padding={'.6rem 0'}
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
