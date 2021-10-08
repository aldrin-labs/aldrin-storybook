import React, { ReactNode } from 'react'

import {
  TradeInput,
  TradeSelect,
  Coin,
} from '@sb/components/TraidingTerminal/styles'
import {
  TradeInputContent,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'
import { TooltipContainer, Tooltip } from '@sb/components/TooltipCustom/Tooltip'

import { Theme } from '@material-ui/core'
import { BeforeCharacter, InputRowContainer } from './styles'
import { InputProps } from './types'

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
  theme,
}: InputProps) => {
  return (
    <div
      style={{ width, padding, position: 'relative', display: 'inline-block' }}
    >
      <Character needCharacter={needCharacter} beforeSymbol={beforeSymbol}>
        {beforeSymbol}
      </Character>
      <TradeInput
        theme={theme}
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
  theme,
}: InputProps) => {
  return (
    <div
      style={{ width, padding, position: 'relative', display: 'inline-block' }}
    >
      <TradeSelect
        theme={theme}
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
  padding,
  needLine = true,
  needRightValue = false,
  rightValue = '',
  lineMargin = '0 0 0 1rem',
  haveTooltip = false,
  tooltipText = '',
  tooltipStyles = {},
  onValueClick = () => {},
  theme,
  style,
}: {
  title: string
  children: ReactNode
  padding?: string
  needLine?: boolean
  lineWidth?: string
  needRightValue?: boolean
  rightValue?: string
  lineMargin?: string
  haveTooltip?: boolean
  tooltipText?: string | React.ReactChild
  tooltipStyles?: React.CSSProperties
  onValueClick?: any
  theme: Theme
  style: React.CSSProperties
}) => {
  return (
    <InputRowContainer padding={padding} direction="column" style={style}>
      {/* {haveTooltip ? (
        <TooltipContainer
          style={{ display: 'flex', width: '100%', cursor: 'pointer' }}
        >
          <Tooltip style={{ ...tooltipStyles }}>{tooltipText}</Tooltip> */}
      <TradeInputHeader
        theme={theme}
        title={title}
        haveTooltip={haveTooltip}
        needLine={needLine}
        lineMargin={lineMargin}
        tooltipText={tooltipText}
        tooltipStyles={tooltipStyles}
        needRightValue={needRightValue}
        rightValue={rightValue}
        onValueClick={onValueClick}
      />
      {/* </TooltipContainer>
      ) : (
        <TradeInputHeader
          title={title}
          needLine={needLine}
          lineMargin={lineMargin}
          needRightValue={needRightValue}
          rightValue={rightValue}
          onValueClick={onValueClick}
        />
      )} */}
      {children}
    </InputRowContainer>
  )
}
