import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { InvisibleInput } from '@sb/compositions/Pools/components/Popups/index.styles'
import { formatNumbersForState } from '@sb/dexUtils/utils'

import { stripByAmount } from '@core/utils/chartPageUtils'

import WalletIcon from '@icons/walletIcon.svg'

import { AmountInputContainer, InputContainer, MaxAmountRow } from './styles'

export const SwapAmountInput = ({
  amount = '',
  maxAmount = '0.00',
  disabled = false,
  title = 'Title',
  placeholder = '0.00',
  onChange = () => {},
  onMaxAmountClick = () => {},
  appendComponent = null,
}: {
  amount?: string | number
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
      padding="0em 1em"
    >
      <RowContainer justify="space-between">
        <Text fontSize={FONT_SIZES.sm} fontFamily="Avenir Next" color="white1">
          {title}
        </Text>
        <MaxAmountRow onClick={onMaxAmountClick}>
          <SvgIcon
            src={WalletIcon}
            width={FONT_SIZES.sm}
            height={FONT_SIZES.sm}
          />
          <Text
            fontSize={FONT_SIZES.sm}
            fontFamily="Avenir Next Demi"
            color="gray1"
            padding="0 0 0 0.2em"
          >
            {maxAmount ? stripByAmount(maxAmount) : '0.00'}
          </Text>
        </MaxAmountRow>
      </RowContainer>
      <RowContainer
        wrap="nowrap"
        justify="space-between"
        align="flex-end"
        margin="0.6em 0 0 0"
      >
        <AmountInputContainer>
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
        </AmountInputContainer>
        {appendComponent}
      </RowContainer>
    </InputContainer>
  )
}
