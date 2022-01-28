import { Theme } from '@material-ui/core'
import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueText } from '@sb/compositions/Pools/components/Popups/components/index.styles'
import {
  StyledInput,
  TokenContainer,
  InvisibleInput,
} from '@sb/compositions/Pools/components/Popups/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { stripInputNumber } from '@sb/dexUtils/utils'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Arrow from '@icons/arrowBottom.svg'

export const InputWithSelectorForSwaps = ({
  theme,
  value,
  symbol,
  disabled,
  maxBalance,
  padding,
  directionFrom,
  placeholder,
  publicKey,
  wallet,
  onChange,
  openSelectCoinPopup,
}: {
  theme: Theme
  value: string | number
  symbol: string
  disabled?: boolean
  padding?: string
  maxBalance: number
  directionFrom?: boolean
  placeholder?: string
  publicKey: string
  wallet: any
  onChange: (value: string | number) => void
  openSelectCoinPopup: () => void
}) => {
  const isSelectToken = symbol === 'Select token'

  return (
    <Row style={{ position: 'relative' }} width="100%">
      <StyledInput disabled={disabled} />
      <TokenContainer left="2rem" top="1rem">
        <Text color={theme.palette.grey.title}>
          {directionFrom ? 'From:' : 'To (Estimate):'}
        </Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="1rem">
        <InvisibleInput
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(stripInputNumber(e, value))
          }}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer style={{ cursor: 'pointer' }} right="2rem" bottom="1rem">
        <Row
          style={{ flexWrap: 'nowrap' }}
          onClick={() => {
            openSelectCoinPopup()
          }}
        >
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            width="2rem"
            height="2rem"
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
        <TokenContainer right="2rem" top="1rem">
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text color={theme.palette.grey.title} fontSize="1.2rem">
              &nbsp;Balance:
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
