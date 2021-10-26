import React from 'react'
import { useFormik } from 'formik'
import { TokenInfo } from '@sb/dexUtils/types'
import { FormWrap, FormItem } from '../Staking.styles'
import { Input, INPUT_FORMATTERS } from '@sb/components/Input'
import StakeBtn from '@icons/stakeBtn.png'

import { Button } from '../../../components/Button'

interface StakingFormProps {
  tokenData: TokenInfo
  loading: boolean
  start: (amount: number) => any
  end: () => any
  totalStaked: number
}

export const StakingForm: React.FC<StakingFormProps> = (props) => {
  const { tokenData, totalStaked, loading, start, end } = props

  const form = useFormik({
    // validateOnMount: true,
    initialValues: {
      amount: `${tokenData?.amount || 0}`,
    },
    onSubmit: async (values) => {
      start(parseFloat(values.amount))
      return false
    },
    validate: (values) => {
      if (!values.amount) {
        return { amount: 'Enter value' }
      }
      const amount = parseFloat(values.amount)
      if (amount <= 0) {
        return { amount: 'Too small' }
      }

      if (amount > (tokenData?.amount || 0)) {
        return { amount: 'Too big' }
      }
      return
    },
  })

  return (
    <FormWrap onSubmit={form.handleSubmit}>
      <FormItem>
        <Input
          placeholder="Enter amount..."
          value={form.values.amount}
          onChange={async (v) => {
            await form.setFieldValue('amount', v)
            form.validateForm()
          }}
          name="amount"
          append="RIN"
          formatter={INPUT_FORMATTERS.DECIMAL}
        />
      </FormItem>
      <FormItem>
        <Button
          backgroundImage={StakeBtn}
          fontSize="xs"
          padding="lg"
          borderRadius="xxl"
          disabled={Object.keys(form.errors).length !== 0 || loading}
        >
          Stake
        </Button>
      </FormItem>
      <FormItem>
        <Button
          backgroundImage={StakeBtn}
          fontSize="xs"
          padding="lg"
          borderRadius="xxl"
          disabled={totalStaked === 0 || loading}
          onClick={() => end()}
          type="button"
        >
          Unstake all
        </Button>
      </FormItem>
    </FormWrap>
  )
}
