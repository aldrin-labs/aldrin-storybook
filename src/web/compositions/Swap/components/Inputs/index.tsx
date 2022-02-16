import { Theme } from '@material-ui/core'
import { COLORS, BORDER_RADIUS, FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueText } from '@sb/compositions/Pools/components/Popups/components/index.styles'
import {
  StyledInput,
  TokenContainer,
  InvisibleInput,
} from '@sb/compositions/Pools/components/Popups/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { stripInputNumber } from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import Arrow from '@icons/arrowBottom.svg'
import WalletIcon from '@icons/wallet.svg'

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

const InputContainer = styled(RowContainer)`
  position: relative;
  justify-content: space-between;
  height: 4em;
  background: ${(props) =>
    props.disabled ? COLORS.disabledInput : COLORS.blockBackground};
  border: 0.1rem solid #383b45;
  border-radius: 0;
  ${(props) =>
    props.roundSides.map(
      (roundSide: string) => `border-${roundSide}-radius: ${BORDER_RADIUS.md};`
    )}
`

const DropdownIconContainer = styled(Row)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
`

export const TokenSelector = ({
  symbol,
  roundSides = [],
  onClick,
}: {
  symbol: string
  roundSides?: string[]
  onClick: () => void
}) => {
  return (
    <InputContainer
      roundSides={roundSides}
      padding="0 0.8em"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Row>
        <TokenIcon
          mint={getTokenMintAddressByName(symbol)}
          width={FONT_SIZES.xl}
          height={FONT_SIZES.xl}
        />
        <Text
          style={{ margin: '0 0.8rem' }}
          fontSize={symbol.length > 4 ? FONT_SIZES.md : FONT_SIZES.xmd}
          fontFamily="Avenir Next Demi"
        >
          {symbol}
        </Text>
      </Row>
      <DropdownIconContainer>
        <SvgIcon src={Arrow} width="0.6875em" height="0.6875em" />
      </DropdownIconContainer>
    </InputContainer>
  )
}

export const SwapAmountInput = ({
  amount = '',
  maxAmount = '0.00',
  disabled = false,
  title = 'Title',
  placeholder = '0.00',
  roundSides = [],
  onChange = () => {},
  appendComponent = null,
}: {
  amount?: string | number
  maxAmount?: number | string
  disabled?: boolean
  title?: string
  placeholder?: string
  roundSides?: string[]
  onChange?: (value: number | string) => void
  appendComponent?: any
}) => {
  return (
    <InputContainer
      disabled={disabled}
      direction="column"
      padding="0.3em 1em"
      roundSides={roundSides}
    >
      <RowContainer justify="space-between">
        <Text fontSize={FONT_SIZES.sm} fontFamily="Avenir Next" color="#C9C8CD">
          {title}
        </Text>
        <Row>
          <Text
            fontSize={FONT_SIZES.sm}
            fontFamily="Avenir Next Demi"
            color="#91e073"
            padding="0 0.8rem 0 0"
          >
            {maxAmount ? stripByAmount(maxAmount) : '0.00'}
          </Text>
          <SvgIcon
            src={WalletIcon}
            width={FONT_SIZES.sm}
            height={FONT_SIZES.sm}
          />
        </Row>
      </RowContainer>
      <RowContainer justify="space-between">
        <Row width="50%">
          <InvisibleInput
            type="text"
            value={amount || ''}
            disabled={disabled}
            onChange={(e) => {
              onChange(stripInputNumber(e, amount))
            }}
            placeholder={placeholder}
          />
        </Row>
        {appendComponent}
      </RowContainer>
    </InputContainer>
  )
}
