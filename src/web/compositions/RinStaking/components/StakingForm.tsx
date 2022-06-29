import { COLORS } from '@variables/variables'
import { useFormik } from 'formik'
import React from 'react'

import { MINIMAL_STAKING_AMOUNT } from '@sb/dexUtils/common/config'
import { STAKING_FARMING_TOKEN_DECIMALS } from '@sb/dexUtils/staking/config'
import { TokenInfo } from '@sb/dexUtils/types'
import {
  formatNumberWithSpaces,
  formatNumbersForState,
} from '@sb/dexUtils/utils'

import { limitDecimalsCustom } from '@core/utils/numberUtils'

import { AmountInput } from '../../../components/AmountInput'
import { ButtonWrapper, FormItemFull, FormWrap, InputWrapper } from '../styles'
import { StakingFormButton } from './styles'

interface StakingFormProps {
  tokenData: TokenInfo | undefined
  loading: { stake: boolean; unstake: boolean }
  start: (amount: number) => any
}

export const StakingForm: React.FC<StakingFormProps> = (props) => {
  const { tokenData, loading, start } = props

  const form = useFormik({
    // validateOnMount: true,
    initialValues: {
      amount: '0',
    },
    onSubmit: async (values) => {
      start(parseFloat(values.amount))
      return false
    },
    validate: async (values) => {
      if (!values.amount) {
        return { amount: 'Enter value' }
      }
      const amount = parseFloat(values.amount)
      const minStakingAmount =
        MINIMAL_STAKING_AMOUNT / 10 ** STAKING_FARMING_TOKEN_DECIMALS

      if (amount <= minStakingAmount) {
        return { amount: 'Too small' }
      }

      if (amount > (tokenData?.amount || 0)) {
        return { amount: 'Too big' }
      }
      return null
    },
  })

  return (
    <FormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <AmountInput
            usdValue={1}
            data-testid="rin-staking-amount-field"
            label="Stake"
            placeholder="0"
            amount={tokenData?.amount || 0}
            mint={tokenData?.mint || ''}
            name="amount"
            value={formatNumberWithSpaces(form.values.amount)}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v)
              const valueForState = formatNumbersForState(value)
              await form.setFieldValue('amount', valueForState)
              form.validateForm()
            }}
          />
        </InputWrapper>
        <ButtonWrapper>
          <StakingFormButton
            data-testid="rin-staking-submit-btn"
            backgroundColor={COLORS.primaryBlue}
            $fontSize="sm"
            $borderRadius="md"
            $loading={loading.stake}
            disabled={Object.keys(form.errors).length !== 0 || loading.stake}
          >
            Stake
          </StakingFormButton>
        </ButtonWrapper>
      </FormItemFull>
    </FormWrap>
  )
}
