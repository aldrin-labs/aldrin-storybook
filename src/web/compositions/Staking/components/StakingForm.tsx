import { useFormik } from 'formik'
import React, { useEffect, useRef } from 'react'

import { Input, INPUT_FORMATTERS } from '@sb/components/Input'
import { Loader } from '@sb/components/Loader/Loader'
import { TokenInfo } from '@sb/dexUtils/types'

import { limitDecimalsCustom, stripByAmount } from '@core/utils/chartPageUtils'

import StakeBtn from '@icons/stakeBtn.png'

import { Button } from '../../../components/Button'
import { FormWrap, FormItemFull, InputWrapper, ButtonWrapper } from '../styles'

interface StakingFormProps {
  tokenData: TokenInfo | undefined
  loading: { stake: boolean; unstake: boolean }
  start: (amount: number) => any
  end: () => any
  totalStaked: number
  isUnstakeLocked: boolean
  unlockAvailableDate: number
}

export const StakingForm: React.FC<StakingFormProps> = (props) => {
  const {
    tokenData,
    totalStaked,
    loading,
    start,
    end,
    isUnstakeLocked,
    unlockAvailableDate,
  } = props
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
      if (amount <= 0) {
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
    if (!prevTokenData.current && tokenData) {
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
            backgroundImage={StakeBtn}
            fontSize="xs"
            padding="lg"
            borderRadius="xxl"
            disabled={Object.keys(form.errors).length !== 0 || loading.stake}
          >
            {loading.stake ? <Loader /> : 'Stake'}
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            fontSize="xs"
            padding="lg"
            borderRadius="xxl"
            onClick={() => end()}
            disabled={isUnstakeDisabled}
            type="button"
          >
            {loading.unstake ? <Loader /> : 'Unstake'}
          </Button>
        </ButtonWrapper>
      </FormItemFull>
      {/* <FormItemFull>
        <InputWrapper>
          <Input
            placeholder="Enter amount..."
            value={form.values.amountUnstake}
            onChange={async (v) => {
              const value = limitDecimalsCustom(v.toString())
              await form.setFieldValue('amountUnstake', value)
              form.validateForm()
            }}
            name="amountUntake"
            append="RIN"
            maxButton
            maxButtonOnClick={() =>
              maxButtonOnClick('amountUnstake', tokenData?.amount)
            }
            halfButton
            halfButtonOnClick={() =>
              halfButtonOnClick('amountUnstake', tokenData?.amount)
            }
            formatter={INPUT_FORMATTERS.DECIMAL}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            fontSize="xs"
            padding="lg"
            borderRadius="xxl"
            onClick={() => end()}
            disabled={isUnstakeDisabled}
            type="button"
          >
            {loading.unstake ? <Loader /> : 'Unstake'}
          </Button>
        </ButtonWrapper>
      </FormItemFull> */}
      {/* {isUnstakeLocked && (
        <DarkTooltip
          title={
            isUnstakeLocked
              ? `Locked until ${dayjs
                  .unix(unlockAvailableDate)
                  .format('HH:mm:ss MMM DD, YYYY')}`
              : ''
          }
        >
          <div>
            <SvgIcon
              src={InfoIcon}
              width={'1.5rem'}
              height={'1.5rem'}
              style={{ marginTop: '1.5rem' }}
            />
          </div>
        </DarkTooltip>
      )} */}
    </FormWrap>
  )
}
