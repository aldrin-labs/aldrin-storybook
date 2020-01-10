import React, { ReactNode } from 'react'

import { InputProps } from './types'
import {
  TradeInput,
  TradeSelect,
  Coin,
} from '@sb/components/TraidingTerminal/styles'
import {
  TradeInputContent,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'

import { BeforeCharacter, InputRowContainer } from './styles'

export const Character = ({
  needCharacter,
  beforeSymbol,
}: {
  needCharacter: boolean
  beforeSymbol: '+' | '-' | ''
}) => {
  return (
    <BeforeCharacter needCharacter={needCharacter} beforeSymbol={beforeSymbol}>
      {beforeSymbol}
    </BeforeCharacter>
  )
}

export const Input = ({
  symbol,
  value,
  width = '100%',
  padding = '0',
  pattern = '',
  type = 'number',
  list = '',
  min = '0',
  max,
  needCharacter = false,
  beforeSymbol = '',
  placeholder = '',
  onChange,
  isDisabled = false,
  isValid = true,
  showErrors = false,
  inputStyles,
}: InputProps) => {
  return (
    <div
      style={{ width, padding, position: 'relative', display: 'inline-block' }}
    >
      <Character needCharacter={needCharacter} beforeSymbol={beforeSymbol}>
        {beforeSymbol}
      </Character>
      <TradeInput
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        pattern={pattern}
        placeholder={placeholder}
        type={type}
        list={list}
        min={min}
        max={max}
        needCharacter={needCharacter}
        step={symbol === '%' ? 1 : ''}
        isValid={showErrors ? isValid : true}
        style={inputStyles}
      />
      <Coin right={type !== 'number' ? '12px' : ''}>{symbol}</Coin>
    </div>
  )
}

export const Select = ({
  value,
  width = '85%',
  padding = '0',
  onChange,
  isDisabled = false,
  isValid = true,
  showErrors = false,
  inputStyles,
  children,
}: InputProps) => {
  return (
    <div
      style={{ width, padding, position: 'relative', display: 'inline-block' }}
    >
      <TradeSelect
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        style={inputStyles}
        isValid={isValid}
        showErrors={showErrors}
      >
        {children}
      </TradeSelect>
    </div>
  )
}

export const FormInputContainer = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <InputRowContainer direction="column">
      <TradeInputHeader
        title={title}
        needLine={true}
        // needRightValue={true}
        // rightValue={`${maxSpotAmount} ${pair[0]}`}
        // onValueClick={() =>
        //   this.onAmountChange({
        //     target: {
        //       value: maxSpotAmount,
        //     },
        //   })
        // }
      />
      {children}
    </InputRowContainer>
  )
}
