import React from 'react'

import { StretchedBlock } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'
import { formatNumbersForState } from '@sb/dexUtils/utils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { WalletIcon } from '../Icons'
import {
  AmountInputContainer,
  CenteredRow,
  InputContainer,
  InvisibleInput,
  StyledInlineText,
} from './index.styles'

export const AmountInput = ({
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
    <InputContainer>
      <StretchedBlock width="xl">
        <InlineText weight={400} size="sm" color="white3">
          {title}
        </InlineText>
        <CenteredRow onClick={onMaxAmountClick}>
          <WalletIcon />
          <StyledInlineText weight={600} size="sm" color="white2">
            {maxAmount ? stripDigitPlaces(maxAmount, 2) : '0.00'}
          </StyledInlineText>
        </CenteredRow>
      </StretchedBlock>
      <StretchedBlock width="xl" align="flex-end" margin="0.6em 0 0 0">
        <AmountInputContainer>
          <InvisibleInput
            // data-testid={`swap-${title.replaceAll(' ', '-')}-field`}
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
      </StretchedBlock>
    </InputContainer>
  )
}
