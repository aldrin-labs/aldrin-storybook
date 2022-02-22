import React from 'react'

import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { Row } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'
import {
  InvisibleInput,
  TokenContainer,
} from '@sb/compositions/Pools/components/Popups/index.styles'
import { StakingInput } from '@sb/compositions/RinStaking/styles'

import { stripByAmount } from '@core/utils/chartPageUtils'

import WalletIcon from '@icons/walletNew.svg'

export const StakingInputWithAttributes = ({
  value,
  disabled,
  directionText,
  placeholder,
  needButtons = true,
  onChange,
}: {
  value: string | number
  disabled?: boolean
  directionText?: string
  placeholder?: string
  needButtons?: boolean
  onChange: (value: string | number) => void
}) => {
  return (
    <Row style={{ position: 'relative', width: '100%' }}>
      <StakingInput />
      <TokenContainer left="2rem" top="0.5rem">
        <InlineText color="lightGrey" size="es">
          {directionText}
        </InlineText>
      </TokenContainer>
      <TokenContainer style={{ width: '80%' }} left="2rem" bottom="1rem">
        <InvisibleInput
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(stripByAmount(e.target.value))
          }}
          placeholder={placeholder}
        />
      </TokenContainer>
      <TokenContainer style={{ cursor: 'pointer' }} right="2rem" bottom="1rem">
        {needButtons ? (
          <Row style={{ flexWrap: 'nowrap' }} justify="space-between">
            {' '}
            <Button
              minWidth="2rem"
              $borderRadius="xxl"
              onClick=""
              type="button"
              $variant="input"
            >
              Half
            </Button>
            &nbsp;
            <Button
              minWidth="2rem"
              $borderRadius="xxl"
              onClick=""
              type="button"
              $variant="input"
            >
              Max
            </Button>{' '}
          </Row>
        ) : (
          <InlineText>~$1,000.00</InlineText>
        )}
      </TokenContainer>
      <TokenContainer right="2rem" top="0.5rem">
        <Row style={{ flexWrap: 'nowrap' }} align="center">
          <InlineText weight={600} size="md" color="newGreen">
            {stripByAmount(1000)}
          </InlineText>
          &nbsp;
          <SvgIcon src={WalletIcon} width="14px" height="19px" />
        </Row>
      </TokenContainer>
    </Row>
  )
}
