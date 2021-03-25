import React, { useState, useEffect } from 'react'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { PercentageTab, PercentageTabsContainer } from './styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import SvgIcon from '@sb/components/SvgIcon'

import Info from '@icons/inform.svg'
import { DarkTooltip } from '../TooltipCustom/Tooltip'

import { PercentageTab, PercentageTabsContainer } from './styles'

import HeightIcon from '@material-ui/icons/Height'
import { SliderWithPriceAndPercentageFieldRowProps } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'
import BlueSlider from '@sb/components/Slider/BlueSlider'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import {
  Select,
  FormInputContainer,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'

export const ButtonsWithAmountFieldRowForBasic = ({
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

  const percentages = [
    {
      value: 10,
    },
    {
      value: 25,
    },
    {
      value: 50,
    },
    {
      value: 75,
    },
    {
      value: 100,
    },
  ]

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
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {isSPOTMarket ? (
            <InputRowContainer padding="0" style={{ width: '49%' }}>
              <Input
                theme={theme}
                needTitle
                title={`${isSPOTMarket ? 'amount' : 'order quantity'}`}
                value={localAmount}
                type={'text'}
                pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
                onChange={onAmountChange}
                symbol={pair[0]}
              />{' '}
            </InputRowContainer>
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
          {isSPOTMarket && (
            <InputRowContainer
              key={'total'}
              padding={'0 0 0rem 0'}
              direction={'column'}
              style={{ width: '49%' }}
            >
              <Input
                theme={theme}
                needTitle
                type={'text'}
                title={`total`}
                value={localTotal || ''}
                onChange={onTotalChange}
                symbol={pair[1]}
              />
            </InputRowContainer>
          )}
        </div>
        <InputRowContainer
          style={{
            height: '4rem',
            margin: '.5rem 0',
          }}
        >
          <PercentageTabsContainer>
            {percentages.map((el) => (
              <PercentageTab
                theme={theme}
                isActive={false}
                onClick={() => {
                  onAfterSliderChange(el.value)
                }}
              >
                {el.value}%
              </PercentageTab>
            ))}
            <DarkTooltip
              title={
                <>
                  <p>
                    Minimal step size for SOL/USDC pair is{' '}
                    <strong>0.1 SOL</strong>
                  </p>
                  <p>
                    Therefore, the percentage of your balance will be rounded to
                    one decimal when calculating the percentage.
                  </p>
                </>
              }
            >
              <div style={{ width: '5%', height: '2rem' }}>
                {' '}
                <SvgIcon width="100%" height="auto" src={Info} />
              </div>
            </DarkTooltip>
          </PercentageTabsContainer>
          {/* <BlueSlider
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
              updateLocalTotal(stripDigitPlaces(newTotal, 3))
              updateLocalMargin(newMargin)
            }}
            onAfterChange={onAfterSliderChange}
          /> */}
        </InputRowContainer>
      </InputRowContainer>

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
            title={`margin`}
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
