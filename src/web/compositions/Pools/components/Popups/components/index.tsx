import React from 'react'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { StyledInput, TokenContainer, InvisibleInput } from '../index.styles'
import Arrow from '@icons/arrowBottom.svg'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { Theme } from '@material-ui/core'
import { BlueText } from './index.styles'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

export const InputWithCoins = ({
  theme,
  value,
  symbol,
  alreadyInPool,
  maxBalance,
  onChange,
}: {
  theme: Theme
  value: string | number
  symbol: string
  alreadyInPool: number
  maxBalance: number
  onChange: (value: number | string) => void
}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={theme.palette.grey.title}>{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left={'2rem'} bottom={'3rem'}>
        <InvisibleInput
          type={'number'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={''}
        />
      </TokenContainer>
      <TokenContainer right={'2rem'} bottom={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            width={'2rem'}
            height={'2rem'}
          />
          <Text
            style={{ marginLeft: '0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            {symbol}
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer right={'2rem'} top={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color={theme.palette.grey.title} fontSize={'1.2rem'}>
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
          <Text color={theme.palette.grey.title} fontSize={'1.2rem'}>
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
  theme: Theme
  value: number
}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={theme.palette.grey.title}>Total</Text>
      </TokenContainer>
      <TokenContainer left={'2rem'} bottom={'3rem'}>
        <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
          {formatNumberToUSFormat(stripDigitPlaces(value, 2))}
        </Text>
      </TokenContainer>
      <TokenContainer right={'2rem'} bottom={'3rem'}>
        <Row>
          <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
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
  theme: Theme
  value: string | number
  symbol: string
  disabled?: boolean
  maxBalance: number
  onChange: (value: string | number) => void
  openSelectCoinPopup: () => void
}) => {
  const isSelectToken = symbol === 'Select token'

  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={theme.palette.grey.title}>{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left={'2rem'} bottom={'3rem'}>
        <InvisibleInput
          type={'number'}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={''}
        />
      </TokenContainer>
      <TokenContainer
        style={{ cursor: 'pointer' }}
        right={'2rem'}
        bottom={'3rem'}
      >
        <Row style={{ flexWrap: 'nowrap' }} onClick={openSelectCoinPopup}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            width={'2rem'}
            height={'2rem'}
          />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            {symbol}
          </Text>
          <SvgIcon src={Arrow} width={'1rem'} height={'1rem'} />
        </Row>
      </TokenContainer>
      {!isSelectToken && (
        <TokenContainer right={'2rem'} top={'3rem'}>
          <Row style={{ flexWrap: 'nowrap' }}>
            <Text color={theme.palette.grey.title} fontSize={'1.2rem'}>
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
  onChange,
}: {
  theme: Theme
  value: string | number
  symbol: string
  maxBalance: number
  onChange: (value: string | number) => void
}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={theme.palette.grey.title}>{symbol}</Text>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left={'2rem'} bottom={'3rem'}>
        <InvisibleInput
          type={'number'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={''}
        />
      </TokenContainer>
      <TokenContainer right={'2rem'} bottom={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <TokenIcon
            mint={getTokenMintAddressByName(symbol)}
            width={'2rem'}
            height={'2rem'}
          />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            {symbol}
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer right={'2rem'} top={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color={theme.palette.grey.title} fontSize={'1.2rem'}>
            &nbsp;Max:
          </Text>
          &nbsp;
          <BlueText theme={theme} onClick={() => onChange(maxBalance)}>
            {formatNumberToUSFormat(stripDigitPlaces(maxBalance, 2))} {symbol}
          </BlueText>
        </Row>
      </TokenContainer>
    </Row>
  )
}
