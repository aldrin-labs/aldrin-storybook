import React, { useState, useEffect } from 'react'
import SvgIcon from '@sb/components/SvgIcon'

import Chain from '@icons/chain.svg'

import { InputRowContainer, Switcher } from '../styles'

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
  header = 'level',
  theme,
  needChain = true,
  entryPoint,
  titleForTooltip,
  needTooltip = false,
  showErrors,
  isPlotActive = false,
  maxSliderValue,
  showMarks,
  percentageInputWidth = '50%',
  validateField,
  isTrailingOn = false,
  pricePercentage,
  approximatePrice,
  getApproximatePrice,
  onAfterSliderChange,
  percentagePreSymbol,
  percentageTextAlign = 'right',
  tvAlertsEnable = false,
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
          needChain={needChain}
          header={header}
          needTitleBlock
          padding={'0'}
          width={
            sliderInTheBottom
              ? '65%'
              : tvAlertsEnable
              ? '55%'
              : isTrailingOn
              ? 'calc(36.5%)'
              : 'calc(31.5%)'
          }
          textAlign={'right'}
          symbol={pair[1]}
          value={
            pricePercentage !== value
              ? getApproximatePrice(value)
              : approximatePrice
          }
          disabled={isPlotActive}
          showErrors={showErrors}
          isValid={validateField(true, pricePercentage)}
          inputStyles={{
            paddingLeft: '0.5rem',
          }}
          onChange={(e) => onApproximatePriceChange(e, updateValue)}
        />
      )}
      {needChain && (
        <SvgIcon
          src={Chain}
          width={'1.6rem'}
          height={'1.6rem'}
          style={{ margin: 'auto 0.5rem' }}
        />
      )}
      <Input
        theme={theme}
        padding={
          sliderInTheBottom
            ? '0 0 0 .8rem'
            : needChain
            ? '0 .8rem 0 0rem'
            : tvAlertsEnable
            ? '0 .8rem 0 .8rem'
            : '0 .8rem 0 0rem'
        }
        width={
          sliderInTheBottom
            ? '35%'
            : needPriceField && !tvAlertsEnable
            ? 'calc(24.5%)'
            : tvAlertsEnable
            ? '42%'
            : percentageInputWidth
        }
        symbol={'%'}
        preSymbol={percentagePreSymbol}
        textAlign={percentageTextAlign}
        needPreSymbol={false}
        value={value}
        needTooltip
        disabled={isPlotActive}
        titleForTooltip={titleForTooltip}
        needTitleBlock
        header={'level'}
        showErrors={showErrors}
        isValid={validateField(true, pricePercentage)}
        inputStyles={
          percentageTextAlign === 'left'
            ? {
                paddingRight: '0',
                paddingLeft: '0.5rem',
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
          showMarks={showMarks}
          theme={theme}
          disabled={isPlotActive}
          value={value}
          max={maxSliderValue}
          sliderContainerStyles={{
            width: isTrailingOn ? '30%' : '40%',
            margin: '0 .8rem 0 .8rem',
          }}
          onChange={(v) =>
            v > maxSliderValue ? updateValue(maxSliderValue) : updateValue(v)
          }
          onAfterChange={onAfterSliderChange}
        />
      ) : (
        <InputRowContainer padding={'1.6rem 0 .8rem 0'}>
          <BlueSlider
            showMarks={showMarks}
            disabled={isPlotActive}
            max={maxSliderValue}
            theme={theme}
            value={value}
            sliderContainerStyles={{
              width: sliderInTheBottom ? '100%' : '50%',
              margin: '0 .4rem 0 0.5rem',
            }}
            onChange={(v) =>
              v > maxSliderValue ? updateValue(maxSliderValue) : updateValue(v)
            }
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
  showMarks,
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
        width={'calc(46%)'}
        showErrors={showErrors}
        isValid={validateField(true, timeoutValue)}
        value={value}
        onChange={onTimeoutChange}
        needTooltip
        textDecoration={'underline'}
        titleForTooltip={
          <>
            <p>Waiting after unrealized P&L will reach set target.</p>
            <p>
              <b>For example:</b> you set 10% stop loss and 1 minute timeout.
              When your unrealized loss is 10% timeout will give a minute for a
              chance to reverse trend and loss to go below 10% before stop loss
              order executes.
            </p>
          </>
        }
        header={'timeout'}
        needTitleBlock
        inputStyles={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      <Select
        theme={theme}
        width={'calc(14.5% + 0rem)'}
        value={timeoutMode}
        padding={'0 .8rem 0 0'}
        inputStyles={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onChange={onChangeTimeoutMode}
      >
        <option>sec</option>
        <option>min</option>
      </Select>
      {/* <InputRowContainer padding={'1.6rem 0 .8rem 0'}> */}
      <BlueSlider
        theme={theme}
        max={60}
        value={value}
        sliderContainerStyles={{
          width: 'calc(40%)',
          margin: '0 .8rem',
        }}
        onChange={(v) => updateValue(v)}
        onAfterChange={onAfterSliderChange}
      />
      {/* </InputRowContainer> */}
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
  amount,
  total,
  plotEnabled,
  amountPlot,
  amountPlotEnabled,
  toggleAmountPlotEnabled,
  onAmountPlotChange,
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
      <InputRowContainer style={{ marginBottom: '2rem' }}>
        <div
          style={{
            width: plotEnabled
              ? 'calc((70% - 1rem - 1.6rem) / 2)'
              : marketType === 1
              ? // 2rem is padding from chains, 32px is 2 chain
                'calc((100% - 2rem - 3.2rem) / 3)'
              : 'calc((100% - 1rem - 1.6rem) / 2)',
          }}
        >
          <Input
            theme={theme}
            type={'text'}
            pattern={marketType === 0 ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
            symbol={pair[0]}
            header={'size'}
            needTitleBlock
            needTooltip
            textDecoration={'underline'}
            titleForTooltip={'The leveraged amount of your position.'}
            value={localAmount}
            showErrors={showErrors}
            disabled={amountPlotEnabled && plotEnabled}
            isValid={validateField(true, +entryPoint.order.amount)}
            onChange={onAmountChange}
          />
        </div>
        <SvgIcon
          src={Chain}
          width={'1.6rem'}
          height={'1.6rem'}
          style={{ margin: 'auto 0.5rem' }}
        />
        <div
          style={{
            width: plotEnabled
              ? 'calc((70% - 1rem - 1.6rem) / 2)'
              : marketType === 1
              ? // 2rem is padding from chains, 32px is 2 chain
                'calc((100% - 2rem - 3.2rem) / 3)'
              : 'calc((100% - 1rem - 1.6rem) / 2)',
          }}
        >
          <Input
            theme={theme}
            symbol={pair[1]}
            value={localTotal}
            header={`total`}
            needTitleBlock
            disabled={
              entryPoint.trailing.isTrailingOn ||
              isMarketType ||
              (amountPlotEnabled && plotEnabled)
            }
            onChange={onTotalChange}
          />
        </div>
        {marketType === 1 && !plotEnabled && (
          <>
            <SvgIcon
              width={'1.6rem'}
              height={'1.6rem'}
              src={Chain}
              style={{ margin: 'auto 0.5rem' }}
            />
            <div
              style={{
                width: 'calc((100% - 2rem - 3.2rem) / 3)',
              }}
            >
              <Input
                theme={theme}
                needTooltip
                titleForTooltip={
                  'The actual amount of your position excluding leverage.'
                }
                header={'margin'}
                needTitleBlock
                textDecoration={'underline'}
                symbol={pair[1]}
                value={localMargin}
                onChange={onMarginChange}
              />
            </div>
          </>
        )}

        {/* plot */}
        {plotEnabled && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '10%',
              }}
            >
              <Switcher
                checked={amountPlotEnabled}
                onChange={toggleAmountPlotEnabled}
              />
            </div>
            <Input
              theme={theme}
              type={'number'}
              needTitleBlock
              header={'plot_'}
              textAlign="left"
              width={'calc(20%)'}
              disabled={!amountPlotEnabled}
              value={amountPlot}
              showErrors={showErrors}
              isValid={validateField(true, amountPlot)}
              onChange={onAmountPlotChange}
            />
          </>
        )}
      </InputRowContainer>

      <InputRowContainer>
        <BlueSlider
          theme={theme}
          showMarks
          disabled={plotEnabled && amountPlotEnabled}
          value={
            entryPoint.order.side === 'buy' || marketType === 1
              ? (localTotal / maxAmount) * 100
              : localAmount / (maxAmount / 100)
          }
          sliderContainerStyles={{
            width: 'calc(100% - .8rem)',
            margin: '0 .8rem 0 0.5rem',
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

            updateLocalAmount(stripDigitPlaces(newAmount, quantityPrecision))

            updateLocalTotal(
              stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
            )

            updateLocalMargin(newMargin)
          }}
        />
      </InputRowContainer>
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
            // header={`${isSPOTMarket ? 'amount' : 'order quantity'} (${
            //   pair[0]
            // })`}
            // needTitleBlock
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
                // header={'size'}
                // needTitleBlock
                textDecoration={'outline'}
                value={localAmount}
                type={'text'}
                pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
                onChange={onAmountChange}
                symbol={pair[0]}
              />
            </div>
            <div style={{ width: '50%', paddingLeft: '1%' }}>
              <Input
                inputStyles={{ textDecoration: 'none' }}
                theme={theme}
                //disabled={false}
                needTitle
                title={`total`}
                // header={'total'}
                type={'text'}
                // needTitleBlocks
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
                      quantityPrecision
                    )
                  : +stripDigitPlaces(newValue, quantityPrecision)

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
            // header={`total (${pair[1]})`}
            value={localTotal || ''}
            // needTitleBlock
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
            header={`margin (${pair[1]})`}
            // title={`margin (${pair[1]})`}
            value={localMargin || ''}
            type={'text'}
            heedTitleBlock
            pattern={'[0-9]+.[0-9]{2}'}
            onChange={onMarginChange}
            symbol={pair[1]}
          />
        </InputRowContainer>
      )}
    </>
  )
}
