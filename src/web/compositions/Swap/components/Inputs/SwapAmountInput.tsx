import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InvisibleInput } from '@sb/compositions/Pools/components/Popups/index.styles'
import { stripInputNumber } from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'

import WalletIcon from '@icons/wallet.svg'

import { InputContainer } from './styles'

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
