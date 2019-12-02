import React, { ReactNode } from 'react'

import { InputProps } from './types'
import { TradeInput, Coin } from '@sb/components/TraidingTerminal/styles'

import { InputTitle, BeforeCharacter } from './styles'

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
  width = '85%',
  padding = '0',
  pattern = '',
  type = 'number',
  list = '',
  needCharacter = false,
  beforeSymbol = '',
  onChange,
  isDisabled = false,
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
        type={type}
        list={list}
        needCharacter={needCharacter}
        step={symbol === '%' ? 1 : undefined}
      />
      <Coin right={type !== 'number' ? '12px' : ''}>{symbol}</Coin>
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
    <>
      <div style={{ width: '15%', textAlign: 'right' }}>
        <InputTitle>{title}</InputTitle>
      </div>
      {children}
    </>
  )
}
