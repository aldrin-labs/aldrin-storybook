import { useFormik } from 'formik'
import React from 'react'

import {
  formatNumberWithSpaces,
  formatNumbersForState,
} from '@sb/dexUtils/utils'

import { limitDecimalsCustom } from '@core/utils/chartPageUtils'

import { AmountInput } from '../../../components/AmountInput'
import {
  ButtonWrapper,
  FormItemFull,
  InputWrapper,
  UnstakingFormWrap,
} from '../styles'
import { UnStakingFormButton } from './styles'
import { StakingFormProps } from './types'

export const UnstakingForm: React.FC<StakingFormProps> = (props) => {
  const {
    totalStaked,
    loading,
    end,
    isUnstakeLocked,
    unlockAvailableDate,
    mint,
    tokenPrice,
  } = props

  const now = Date.now() / 1000

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      amount: '0',
    },
    onSubmit: async (values) => {
      end(parseFloat(values.amount))
      return false
    },
    validate: async (values) => {
      if (!values.amount) {
        return { amount: 'Enter value' }
      }
      const amount = parseFloat(values.amount)

      if (amount <= 0) {
        return { amount: 'Too small' }
      }

      if (amount > totalStaked) {
        return { amount: 'Too big' }
      }
      return null
    },
  })

  const isUnstakeDisabled =
    !form.isValid ||
    isUnstakeLocked ||
    totalStaked === 0 ||
    loading.unstake ||
    unlockAvailableDate > now

  const usdAmountValue = +form.values.amount * tokenPrice

  return (
    <UnstakingFormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <AmountInput
            usdValue={usdAmountValue}
            data-testid="rin-unstaking-amount-field"
            placeholder="0"
            amount={totalStaked}
            mint={mint}
            name="amount"
            label="Unstake"
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
          <UnStakingFormButton
            data-testid="rin-unstaking-submit-btn"
            minWidth="14rem"
            $fontSize="sm"
            $borderRadius="md"
            type="submit"
            disabled={isUnstakeDisabled}
            $loading={loading.unstake}
            style={{ padding: '1.75em 1.3em' }}
          >
            Unstake
          </UnStakingFormButton>
        </ButtonWrapper>
      </FormItemFull>
    </UnstakingFormWrap>
  )
}
