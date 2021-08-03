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
        type={'text'}
        pattern={pattern}
        onChange={onChange}
        symbol={symbol[1]}
      />
      <SvgIcon
        src={ReverseArrows}
        width={'3rem'}
        height={'auto'}
        style={{
          position: 'absolute',
          left: '11rem',
          top: '2.5rem',
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
