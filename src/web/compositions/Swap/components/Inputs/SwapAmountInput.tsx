import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { Text } from '@sb/compositions/Addressbook'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InvisibleInput } from '@sb/compositions/Pools/components/Popups/index.styles'
import {
  formatNumbersForState,
  formatNumberWithSpaces,
} from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import WalletIcon from '@icons/walletIcon.svg'

import {
  AmountInputContainer,
  InputContainer,
  MaxAmountRow,
  MaxAmountText,
} from './styles'

export const SwapAmountInput = ({
  amount = '',
  amountUSD = null,
  maxAmount = '0.00',
  disabled = false,
  title = 'Title',
  placeholder = '0.00',
  onChange = () => {},
  onMaxAmountClick = () => {},
  appendComponent = null,
}: {
  amount?: string | number
  amountUSD?: string | number
  maxAmount?: number | string
  disabled?: boolean
  title?: string
  placeholder?: string
  onChange?: (value: number | string) => void
  onMaxAmountClick?: () => void
  appendComponent?: any
}) => {
  return (
    <InputContainer
      disabled={disabled}
      direction="column"
      wrap="nowrap"
      // padding="0em 1em"
    >
      <RowContainer justify="space-between">
        <Text fontSize="0.6em" fontFamily="Avenir Next" color="white3">
          {title}
        </Text>
        <MaxAmountRow onClick={onMaxAmountClick}>
          <SvgIcon
            src={WalletIcon}
            width={FONT_SIZES.sm}
            height={FONT_SIZES.sm}
          />

          <MaxAmountText
            fontSize={FONT_SIZES.sm}
            fontFamily="Avenir Next Demi"
            padding="0 0 0 0.2em"
          >
            {maxAmount ? stripByAmount(maxAmount) : '0.00'}
          </MaxAmountText>
        </MaxAmountRow>
      </RowContainer>
      <RowContainer
        wrap="nowrap"
        justify="space-between"
        align="flex-end"
        // margin="0.6em 0 0 0"
      >
        <AmountInputContainer direction="column" align="flex-start">
          <InvisibleInput
            data-testid={`swap-${title.replaceAll(' ', '-')}-field`}
            type="text"
            value={amount || ''}
            disabled={disabled}
            onChange={(e) => {
              onChange(formatNumbersForState(e.target.value))
            }}
            placeholder={placeholder}
          />
          {!!amountUSD && (
            <InlineText color="white3" size="esm">
              ${formatNumberWithSpaces(stripDigitPlaces(amountUSD, 2))}
            </InlineText>
          )}
        </AmountInputContainer>
        {appendComponent}
      </RowContainer>
    </InputContainer>
  )
}
