import { useFormik } from 'formik'
import React from 'react'

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

  return (
    <UnstakingFormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <AmountInput
            placeholder="0"
            amount={totalStaked}
            mint={mint}
            name="amount"
            label="Unstake"
            value={`${form.values.amount}`}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v)
              await form.setFieldValue('amount', value)
              form.validateForm()
            }}
          />
        </InputWrapper>
        <ButtonWrapper>
          <UnStakingFormButton
            minWidth="14rem"
            $fontSize="sm"
            $borderRadius="md"
            type="submit"
            disabled={isUnstakeDisabled}
            $loading={loading.unstake}
          >
            Unstake
          </UnStakingFormButton>
        </ButtonWrapper>
      </FormItemFull>
    </UnstakingFormWrap>
  )
}
