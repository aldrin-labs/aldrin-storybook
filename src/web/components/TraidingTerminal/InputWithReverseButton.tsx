import React, { useState } from 'react'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { TradeInputContent as Input } from '@sb/components/TraidingTerminal/index'
import SvgIcon from '../SvgIcon'
import ReverseArrows from '@icons/reverseArrows.svg'

export const InputWithReverseButton = ({
  theme,
  mode,
  setMode,
  title,
  value,
  pattern,
  onChange,
  symbol,
}) => {
  return (
    <InputRowContainer
      padding="0 0 0 0"
      style={{ width: '100%', position: 'relative' }}
    >
      <Input
        theme={theme}
        needTitle
        title={title}
        value={value}
        type={'number'}
        pattern="\d*"
        onTitleClick={() => {
          if (mode === 'amount') {
            setMode('total')
          } else {
            setMode('amount')
          }
        }}
        onChange={onChange}
        symbol={mode === 'amount' ? symbol[0] : symbol[1]}
      />
      <SvgIcon
        src={ReverseArrows}
        width={'2rem'}
        height={'auto'}
        style={{
          position: 'absolute',
          left: mode === 'amount' ? '10.5rem' : '7.5rem',
          top: '3rem',
          transform: 'translateY(-50%)',
        }}
        onClick={() => {
          if (mode === 'amount') {
            setMode('total')
          } else {
            setMode('amount')
          }
        }}
      />
    </InputRowContainer>
  )
}
