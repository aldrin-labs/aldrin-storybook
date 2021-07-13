import React, { useState, useEffect } from 'react'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { PercentageTab, PercentageTabsContainer } from './styles'

import SvgIcon from '@sb/components/SvgIcon'
import Info from '@icons/inform.svg'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { SliderWithPriceAndPercentageFieldRowProps } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'

import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

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

export const ButtonsWithAmountFieldRowForBasic = ({
  pair,
  theme,
  priceType,
  onAmountChange,
  onTotalChange,
  isSPOTMarket,
  onAfterSliderChange,
  minOrderSize,
  amount,
  total,
  needButtons = true,
  inputsInOneRow = false,
  inputHeight = '3rem'
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
      <InputRowContainer
        direction="column"
        key={'amount'}
        padding={'.6rem 0'}
        justify={priceType === 'market' ? 'flex-end' : 'center'}
      >
        <InputRowContainer
          direction={inputsInOneRow ? 'row' : 'column'}
          justify={inputsInOneRow ? 'space-between' : 'center'}
        >
          <InputRowContainer
            padding={inputsInOneRow ? '0' : '0 0 1.2rem 0'}
            style={{ width: inputsInOneRow ? 'calc(50% - .5rem)' : '100%' }}
          >
            <Input
              theme={theme}
              needTitle
              title={`amount`}
              value={localAmount}
              type={'text'}
              pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
              onChange={onAmountChange}
              symbol={pair[0]}
              inputStyles={{ height: inputHeight }}
            />
          </InputRowContainer>
          <InputRowContainer
            key={'total'}
            padding={'0 0 0rem 0'}
            direction={'column'}
            style={{ width: inputsInOneRow ? 'calc(50% - .5rem)' : '100%' }}
          >
            <Input
              theme={theme}
              needTitle
              type={'text'}
              title={`total`}
              value={localTotal || ''}
              onChange={onTotalChange}
              symbol={pair[1]}
              inputStyles={{ height: inputHeight }}
            />
          </InputRowContainer>
        </InputRowContainer>
        {needButtons ? (
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
                      Minimal increment for {pair[0]}/{pair[1]} pair is{' '}
                      <strong>{minOrderSize}</strong>
                    </p>
                    <p>
                      For example, if you have{' '}
                      {minOrderSize * 2 + minOrderSize / 2} {pair[0]} then you
                      can only place an order for {minOrderSize * 2} {pair[0]} .
                    </p>
                  </>
                }
              >
                <div style={{ width: '2rem', height: '2rem' }}>
                  <SvgIcon width="100%" height="auto" src={Info} />
                </div>
              </DarkTooltip>
            </PercentageTabsContainer>
          </InputRowContainer>
        ) : null}
      </InputRowContainer>
    </>
  )
}
