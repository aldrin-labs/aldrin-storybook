import { useFormik } from 'formik'
import React from 'react'

import { Button } from '@sb/components/Button'
import { INPUT_FORMATTERS, Input } from '@sb/components/Input'

import { limitDecimalsCustom } from '@core/utils/chartPageUtils'

import { ButtonWrapper, FormItemFull, FormWrap, InputWrapper } from '../styles'

interface StakingFormProps {
  loading: { stake: boolean; unstake: boolean }
  end: (amount: number) => any
  totalStaked: number
  isUnstakeLocked: boolean
  unlockAvailableDate: number
}

export const UnstakingForm: React.FC<StakingFormProps> = (props) => {
  const { totalStaked, loading, end, isUnstakeLocked, unlockAvailableDate } =
    props

  const now = Date.now() / 1000

  const form = useFormik({
    // validateOnMount: true,
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
    <FormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <Input
            placeholder="Enter amount..."
            value={`${form.values.amount}`}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v.toString())
              await form.setFieldValue('amount', value)
              form.validateForm()
            }}
            name="amount"
            append="RIN"
            formatter={INPUT_FORMATTERS.DECIMAL}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            minWidth="70px"
            $fontSize="xs"
            $padding="lg"
            $borderRadius="xxl"
            type="submit"
            disabled={isUnstakeDisabled}
            $loading={loading.unstake}
          >
            Unstake
          </Button>
        </ButtonWrapper>
      </FormItemFull>
    </FormWrap>
  )
}
