import { COLORS } from '@variables/variables'
import { useFormik } from 'formik'
import React from 'react'

import { Button } from '@sb/components/Button'
import { INPUT_FORMATTERS } from '@sb/components/Input'
import { FlexBlock } from '@sb/components/Layout'
import { MINIMAL_STAKING_AMOUNT } from '@sb/dexUtils/common/config'
import { STAKING_FARMING_TOKEN_DECIMALS } from '@sb/dexUtils/staking/config'
import { TokenInfo } from '@sb/dexUtils/types'

import { limitDecimalsCustom, stripByAmount } from '@core/utils/chartPageUtils'

import {
  ButtonWrapper,
  FormItemFull,
  FormWrap,
  InputWrapper,
  StakingInput,
} from '../styles'

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

  const maxButtonOnClick = () => {
    if (tokenData?.amount) {
      form.setFieldValue('amount', stripByAmount(tokenData.amount))
    }
  }

  return (
    <FormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <StakingInput
            placeholder="0"
            value={`${form.values.amount}`}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v.toString())
              await form.setFieldValue('amount', value)
              form.validateForm()
            }}
            name="amount"
            append={
              <FlexBlock direction="row" alignItems="center">
                &nbsp;
                <Button
                  minWidth="2rem"
                  $fontSize="xs"
                  $borderRadius="xxl"
                  onClick={maxButtonOnClick}
                  type="button"
                  $variant="primary"
                >
                  MAX
                </Button>
                &nbsp;
                <span>RIN</span>
              </FlexBlock>
            }
            formatter={INPUT_FORMATTERS.DECIMAL}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            style={{ padding: '2rem' }}
            backgroundColor={COLORS.bluePrimary}
            minWidth="14rem"
            $fontSize="sm"
            $borderRadius="md"
            $loading={loading.stake}
            disabled={Object.keys(form.errors).length !== 0 || loading.stake}
          >
            Stake
          </Button>
        </ButtonWrapper>
      </FormItemFull>
    </FormWrap>
  )
}
