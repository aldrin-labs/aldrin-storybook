import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '@sb/components/AmountInput'
import { Container } from '../index.styles'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

export const ValuesContainer = ({
  isStakedModeOn,
  fromWallet,
  amount,
  setAmountTo,
  setAmountFrom,
}: {
  isStakedModeOn: boolean
  fromWallet: any
  amount: number | string
  setAmountTo: () => void
  setAmountFrom: () => void
}) => {
  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          data-testid="marinade-staking-amount-from-field"
          value={formatNumberWithSpaces(amount)}
          onChange={setAmountFrom}
          placeholder="0"
          name="amountFrom"
          amount={fromWallet?.amount || 0}
          mint={fromWallet?.mint || ''}
          label={isStakedModeOn ? 'Stake' : 'Unstake'}
        />
      </FirstInputContainer>
      <PositionatedIconContainer>+</PositionatedIconContainer>
      <SecondInputContainer>
        <AmountInput
          data-testid="marinade-staking-receive-amount-field"
          value={formatNumberWithSpaces(amountGet)}
          onChange={setAmountTo}
          placeholder="0"
          name="amountTo"
          amount={toWallet?.amount || 0}
          mint={toWallet?.mint || ''}
          label="Receive"
          showButtons={false}
          usdValue={usdValue}
        />
      </SecondInputContainer>
    </InputsContainer>
  )
}
