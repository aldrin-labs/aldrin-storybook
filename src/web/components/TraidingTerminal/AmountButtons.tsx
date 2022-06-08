import React, { useState, useEffect } from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { SliderWithPriceAndPercentageFieldRowProps } from '@sb/compositions/Chart/components/SmartOrderTerminal/types'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

import Info from '@icons/inform.svg'

import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { InputWithReverseButton } from './InputWithReverseButton'
import {
  AmountTooltip,
  PercentageTab,
  PercentageTabsContainer,
  ReverseInputContainer,
  StyledInputsContainer,
} from './styles'

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
  priceType,
  onAmountChange,
  onTotalChange,
  isSPOTMarket,
  onAfterSliderChange,
  minOrderSize,
  amount,
  total,
  needButtons,
}: SliderWithPriceAndPercentageFieldRowProps) => {
  const [localAmount, updateLocalAmount] = useState(amount)
  const [localTotal, updateLocalTotal] = useState(total)
  const [mode, setMode] = useState('amount')

  const isAmountMode = mode === 'amount'

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
        key="amount"
        padding=".6rem 0"
        justify={priceType === 'market' ? 'flex-end' : 'center'}
      >
        <StyledInputsContainer mode={priceType}>
          <InputRowContainer padding="0 0 1.2rem 0" style={{ width: '100%' }}>
            <Input
              needTitle
              title="Est. amount"
              value={formatNumberWithSpaces(localAmount)}
              type="text"
              onChange={onAmountChange}
              symbol={pair[0]}
            />
          </InputRowContainer>
          <InputRowContainer
            key="total"
            padding="0 0 0rem 0"
            direction="column"
            style={{ width: '100%' }}
          >
            <Input
              needTitle
              type="text"
              title="total"
              value={formatNumberWithSpaces(localTotal || 0)}
              onChange={onTotalChange}
              symbol={pair[1]}
            />
          </InputRowContainer>
        </StyledInputsContainer>
        {priceType === 'limit' && (
          <ReverseInputContainer>
            <InputWithReverseButton
              onChange={isAmountMode ? onAmountChange : onTotalChange}
              value={isAmountMode ? localAmount : localTotal}
              symbol={pair}
              setMode={setMode}
              mode={mode}
              title={isAmountMode ? 'amount' : 'total'}
              pattern={
                isAmountMode
                  ? isSPOTMarket
                    ? '[0-9]+.[0-9]{8}'
                    : '[0-9]+.[0-9]{3}'
                  : ''
              }
            />
          </ReverseInputContainer>
        )}

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
                  isActive={false}
                  onClick={() => {
                    onAfterSliderChange(el.value)
                  }}
                >
                  {el.value}%
                </PercentageTab>
              ))}
              <AmountTooltip>
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
                        can only place an order for {minOrderSize * 2} {pair[0]}{' '}
                        .
                      </p>
                    </>
                  }
                >
                  <RowContainer height="2rem">
                    <SvgIcon width="100%" height="100%" src={Info} />
                  </RowContainer>
                </DarkTooltip>
              </AmountTooltip>
            </PercentageTabsContainer>
          </InputRowContainer>
        ) : null}
      </InputRowContainer>
    </>
  )
}
