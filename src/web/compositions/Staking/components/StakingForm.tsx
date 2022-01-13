import { useFormik } from 'formik'
import React, { useEffect, useRef } from 'react'

import { Input, INPUT_FORMATTERS, REGEXP_FORMATTER } from '@sb/components/Input'
import { Loader } from '@sb/components/Loader/Loader'
import { TokenInfo } from '@sb/dexUtils/types'

import { limitDecimalsCustom, stripByAmount } from '@core/utils/chartPageUtils'

import StakeBtn from '@icons/stakeBtn.png'

import { Button } from '../../../components/Button'
import { MINIMAL_STAKING_AMOUNT } from '../../../dexUtils/common/config'
import { STAKING_FARMING_TOKEN_DECIMALS } from '../../../dexUtils/staking/config'
import { ButtonWrapper, FormItemFull, FormWrap, InputWrapper } from '../styles'

interface StakingFormProps {
  tokenData: TokenInfo | undefined
  loading: { stake: boolean; unstake: boolean }
  start: (amount: number) => any
  end: () => any
  totalStaked: number
  isUnstakeLocked: boolean
  unlockAvailableDate: number
}

const INPUT_FORMATTER = REGEXP_FORMATTER(/^\d+(\.?)\d{0,5}$/)
const formatter = (v: string, prevValue: string) =>
  INPUT_FORMATTER(v.replace(',', '.'), prevValue)
export const StakingForm: React.FC<StakingFormProps> = (props) => {
  const { tokenData, totalStaked, loading, start, end, isUnstakeLocked } = props
  const isUnstakeDisabled =
    isUnstakeLocked || totalStaked === 0 || loading.unstake

  const form = useFormik({
    // validateOnMount: true,
    initialValues: {
      amount: 0,
      amountUnstake: 0,
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
      const minStakingAmount =
        MINIMAL_STAKING_AMOUNT / 10 ** STAKING_FARMING_TOKEN_DECIMALS

      if (amount <= minStakingAmount) {
        return { amount: 'Too small' }
      }

      if (amount > (tokenData?.amount || 0)) {
        return { amount: 'Too big' }
      }
    },
  })

  const prevTokenData = useRef(tokenData)

  const maxButtonOnClick = (field: string, value: string | number) => {
    form.setFieldValue(field, stripByAmount(tokenData?.amount))
  }

  const halfButtonOnClick = (field: string, value: string | number) => {
    form.setFieldValue(field, stripByAmount(tokenData?.amount / 2))
  }

  useEffect(() => {
    if (
      tokenData &&
      (!prevTokenData.current ||
        prevTokenData.current.amount !== tokenData.amount)
    ) {
      prevTokenData.current = tokenData
      form.setFieldValue('amount', stripByAmount(tokenData.amount))
    }
  }, [tokenData])

  return (
    <FormWrap onSubmit={form.handleSubmit}>
      <FormItemFull>
        <InputWrapper>
          <Input
            placeholder="Enter amount..."
            value={form.values.amount}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v.toString())
              await form.setFieldValue('amount', value)
              form.validateForm()
            }}
            name="amount"
            append="RIN"
            maxButton
            maxButtonOnClick={() =>
              maxButtonOnClick('amount', tokenData?.amount)
            }
            halfButton
            halfButtonOnClick={() =>
              halfButtonOnClick('amount', tokenData?.amount)
            }
            formatter={INPUT_FORMATTERS.DECIMAL}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            $backgroundImage={StakeBtn}
            $fontSize="xs"
            $padding="lg"
            $borderRadius="xxl"
            disabled={Object.keys(form.errors).length !== 0 || loading.stake}
          >
            {loading.stake ? <Loader /> : 'Stake'}
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            $fontSize="xs"
            $padding="lg"
            $borderRadius="xxl"
            onClick={() => end()}
            disabled={isUnstakeDisabled}
            type="button"
          >
            {loading.unstake ? <Loader /> : 'Unstake'}
          </Button>
        </ButtonWrapper>
      </FormItemFull>
    </FormWrap>
  )
}
