import React, { useState, useEffect } from 'react'
import SvgIcon from '@sb/components/SvgIcon'

import Chain from '@icons/chain.svg'

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
  header = 'level',
  theme,
  needChain = true,
  entryPoint,
  showErrors,
  isMarketType,
  percentageInputWidth = '50%',
  validateField,
  pricePercentage,
  approximatePrice,
  getApproximatePrice,
  onAfterSliderChange,
  percentagePreSymbol,
  percentageTextAlign = 'right',
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
          header={'price'}
          needTitleBlock
          padding={'0'}
          width={sliderInTheBottom ? '65%' : 'calc(31.5%)'}
          textAlign={'right'}
          symbol={pair[1]}
          value={
            pricePercentage !== value
              ? getApproximatePrice(value)
              : approximatePrice
          }
          disabled={false}
          showErrors={showErrors}
          isValid={validateField(true, pricePercentage)}
          inputStyles={{
            paddingLeft: '0.5rem',
          }}
          onChange={(e) => onApproximatePriceChange(e, updateValue)}
        />
      )}
      {needChain && <SvgIcon src={Chain} width={'1.6rem'} height={'1.6rem'} style={{ margin: 'auto 0.5rem' }} />}
      <Input
        theme={theme}
        padding={
          sliderInTheBottom
            ? '0 0 0 .8rem'
            : needPriceField
            ? '0 .8rem 0 0rem'
            : '0 .8rem 0 0rem'
        }
        width={
          sliderInTheBottom
            ? '35%'
            : needPriceField
            ? 'calc(24.5%)'
            : percentageInputWidth
        }
        symbol={'%'}
        preSymbol={percentagePreSymbol}
        textAlign={percentageTextAlign}
        needPreSymbol={false}
        value={value}
        needTitleBlock
        header={header}
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
          theme={theme}
          value={value}
          sliderContainerStyles={{
            width: '40%',
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
              margin: '0 .4rem 0 0.5rem',
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
  funds,
  amount,
  total,
  needChain = false,
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
            width: 'calc((100% - 2rem - 32px) / 3)',
          }}
        >
          {/* <FormInputContainer
            theme={theme}
            needLine={false}
            needRightValue={true}
            rightValue={`${
              entryPoint.order.side === 'buy' || marketType === 1
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
            title={`${marketType === 1 ? 'order quantity' : 'amount'} (${
              pair[0]
            })`}
          > */}
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
            disabled={
              entryPoint.TVAlert.amountPlotEnabled &&
              entryPoint.TVAlert.plotEnabled
            }
            isValid={validateField(true, +entryPoint.order.amount)}
            onChange={onAmountChange}
          />
          {/* </FormInputContainer><< */}
        </div>
        <SvgIcon src={Chain} width={'1.6rem'} height={'1.6rem'} style={{ margin: 'auto 0.5rem' }} />
        <div
          style={{
            width: 'calc((100% - 2rem - 32px) / 3)',
          }}
        >
          {/* <FormInputContainer
            theme={theme}
            needLine={false}
            needRightValue={true}
            rightValue={`${
              entryPoint.order.side === 'buy' || marketType === 1
                ? stripDigitPlaces(maxAmount, marketType === 1 ? 0 : 2)
                : stripDigitPlaces(
                    maxAmount * priceForCalculate,
                    marketType === 1 ? 0 : 2
                  )
            } ${pair[1]}`}
            onValueClick={setMaxAmount}
            title={`total (${pair[1]})`}
          > */}
          <Input
            theme={theme}
            symbol={pair[1]}
            value={localTotal}
            header={`total`}
            needTitleBlock
            disabled={
              entryPoint.trailing.isTrailingOn ||
              isMarketType ||
              (entryPoint.TVAlert.amountPlotEnabled &&
                entryPoint.TVAlert.plotEnabled)
            }
            onChange={onTotalChange}
          />

          {/* </FormInputContainer> */}
        </div>
        <SvgIcon width={'1.6rem'} height={'1.6rem'} src={Chain} style={{ margin: 'auto 0.5rem' }} />
        <div
          style={{
            width: 'calc((100% - 2rem - 32px) / 3)',
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
            disabled={entryPoint.trailing.isTrailingOn || isMarketType}
            onChange={onMarginChange}
          />
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

      {/* {marketType === 1 && (
        <InputRowContainer padding={'.8rem 0 1rem 0'}>
        
          <Input
            theme={theme}
            needTooltip
            titleForTooltip={
              'The actual amount of your position excluding leverage.'
            }
            header={'margin'}
            symbol={pair[1]}
            value={localMargin}
            disabled={entryPoint.trailing.isTrailingOn || isMarketType}
            onChange={onMarginChange}
          />
          
        </InputRowContainer>
      )} */}
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
