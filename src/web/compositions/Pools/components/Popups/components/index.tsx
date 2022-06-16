import React from 'react'
import { DefaultTheme } from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

import {
  getNumberOfIntegersFromNumber,
  getNumberOfDecimalsFromNumber,
} from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Arrow from '@icons/arrowBottom.svg'

import { StyledInput, TokenContainer, InvisibleInput } from '../index.styles'
import { BlueText } from './index.styles'

export const InputWithCoins = ({
  theme,
  value,
  symbol,
  alreadyInPool,
  maxBalance,
  placeholder,
  needAlreadyInPool = true,
  onChange,
}: {
  theme: DefaultTheme
  value: string | number
  symbol: string
  alreadyInPool?: number
  maxBalance: number
  placeholder: string
  needAlreadyInPool: boolean
  onChange: (value: number | string) => void
}) => {
  return (
    <Row style={{ position: 'relative' }} padding="1rem 0" width="100%">
      <StyledInput />
      <TokenContainer left="2rem" top="2rem">
        <Text color="gray1">{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="2rem">
        <InvisibleInput
          type="string"
          value={value}
          onChange={(e) => {
            if (
              getNumberOfIntegersFromNumber(e.target.value) > 8 ||
              getNumberOfDecimalsFromNumber(e.target.value) > 8
            ) {
              // if entered value is less than current
              if (
                getNumberOfIntegersFromNumber(e.target.value) <
                  getNumberOfIntegersFromNumber(value) ||
                getNumberOfDecimalsFromNumber(e.target.value) <
                  getNumberOfDecimalsFromNumber(value)
              ) {
                onChange(e.target.value)
                return
              }
              onChange(value)
            } else {
              onChange(e.target.value)
            }
          }}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer right="2rem" bottom="2rem">
        <Row style={{ flexWrap: 'nowrap' }}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            size={32}
          />
          <Text
            style={{ marginLeft: '0.5rem' }}
            fontSize="2rem"
            fontFamily="Avenir Next Demi"
          >
            {symbol}
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer right="2rem" top="2rem">
        <Row style={{ flexWrap: 'nowrap' }}>
          {needAlreadyInPool && (
            <>
              {' '}
              <Text color="gray1" fontSize="1.2rem">
                Already in pool:
              </Text>
              &nbsp;
              <BlueText
                theme={theme}
                style={{ marginRight: '2rem' }}
                onClick={() => onChange(alreadyInPool)}
              >
                {stripDigitPlaces(alreadyInPool, 2)} {symbol}
              </BlueText>
              &nbsp;
            </>
          )}
          <Text color="gray1" fontSize="1.2rem">
            &nbsp;Max:
          </Text>
          &nbsp;
          <BlueText onClick={() => onChange(maxBalance)} theme={theme}>
            {formatNumberToUSFormat(stripDigitPlaces(maxBalance, 2))} {symbol}
          </BlueText>
        </Row>
      </TokenContainer>
    </Row>
  )
}

export const InputWithTotal = ({
  theme,
  value,
}: {
  theme: DefaultTheme
  value: number
}) => {
  return (
    <Row style={{ position: 'relative' }} padding="1rem 0" width="100%">
      <StyledInput />
      <TokenContainer left="2rem" top="2rem">
        <Text color="gray1">Total</Text>
      </TokenContainer>
      <TokenContainer left="2rem" bottom="2rem">
        <Text fontSize="2rem" fontFamily="Avenir Next Demi">
          {formatNumberWithSpaces(stripDigitPlaces(value, 2))}
        </Text>
      </TokenContainer>
      <TokenContainer right="2rem" bottom="2rem">
        <Row>
          <Text fontSize="2rem" fontFamily="Avenir Next Demi">
            USD
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}

export const InputWithSelector = ({
  theme,
  value,
  symbol,
  disabled,
  maxBalance,
  onChange,
  openSelectCoinPopup,
}: {
  theme: DefaultTheme
  value: string | number
  symbol: string
  disabled?: boolean
  maxBalance: number
  onChange: (value: string | number) => void
  openSelectCoinPopup: () => void
}) => {
  const isSelectToken = symbol === 'Select token'

  return (
    <Row style={{ position: 'relative' }} padding="2rem 0" width="100%">
      <StyledInput />
      <TokenContainer left="2rem" top="3rem">
        <Text color={theme.colors.gray1}>{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="3rem">
        <InvisibleInput
          type="number"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
        />
      </TokenContainer>
      <TokenContainer style={{ cursor: 'pointer' }} right="2rem" bottom="3rem">
        <Row style={{ flexWrap: 'nowrap' }} onClick={openSelectCoinPopup}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            size={32}
          />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize="2rem"
            fontFamily="Avenir Next Demi"
          >
            {symbol}
          </Text>
          <SvgIcon src={Arrow} width="1rem" height="1rem" />
        </Row>
      </TokenContainer>
      {!isSelectToken && (
        <TokenContainer right="2rem" top="3rem">
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text color={theme.colors.gray1} fontSize="1.2rem">
              &nbsp;Max:
            </Text>
            &nbsp;
            <BlueText theme={theme} onClick={() => onChange(maxBalance)}>
              {formatNumberToUSFormat(stripDigitPlaces(maxBalance, 8))} {symbol}
            </BlueText>
          </Row>
        </TokenContainer>
      )}
    </Row>
  )
}

export const SimpleInput = ({
  theme,
  value,
  symbol,
  maxBalance,
  disabled,
  onChange,
  placeholder,
}: {
  theme: DefaultTheme
  value: string | number
  symbol: string
  disabled?: boolean
  maxBalance: number
  placeholder: string
  onChange: (value: string | number) => void
}) => {
  return (
    <Row style={{ position: 'relative' }} padding="2rem 0" width="100%">
      <StyledInput />
      <TokenContainer left="2rem" top="3rem">
        <Text color="gray1">{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="3rem">
        <InvisibleInput
          disabled={disabled}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer right="2rem" bottom="3rem">
        <Row style={{ flexWrap: 'nowrap' }}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            size={32}
          />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize="2rem"
            fontFamily="Avenir Next Demi"
          >
            {symbol}
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer right="2rem" top="3rem">
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color="gray1" fontSize="1.2rem">
            &nbsp;Max:
          </Text>
          &nbsp;
          <BlueText
            theme={theme}
            onClick={() => onChange(stripDigitPlaces(maxBalance, 8))}
          >
            {formatNumberToUSFormat(stripDigitPlaces(maxBalance, 2))} {symbol}
          </BlueText>
        </Row>
      </TokenContainer>
    </Row>
  )
}
