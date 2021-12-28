import dayjs from 'dayjs'
import { useFormik } from 'formik'
import React, { useEffect, useRef } from 'react'

import { SvgIcon } from '@sb/components'
import { Input, REGEXP_FORMATTER } from '@sb/components/Input'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TokenInfo } from '@sb/dexUtils/types'

import { stripByAmount } from '@core/utils/chartPageUtils'

import InfoIcon from '@icons/inform.svg'
import StakeBtn from '@icons/stakeBtn.png'

import { Button } from '../../../components/Button'
import { FormWrap, FormItem, FormItemFull } from '../styles'

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
    },
  })

  const prevTokenData = useRef(tokenData)

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
        <Input
          placeholder="Enter amount..."
          value={form.values.amount}
          onChange={async (v) => {
            await form.setFieldValue('amount', v)
            form.validateForm()
          }}
          name="amount"
          append="RIN"
          formatter={formatter}
        />
      </FormItemFull>
      <FormItem>
        <Button
          $backgroundImage={StakeBtn}
          $fontSize="xs"
          $padding="lg"
          $borderRadius="xxl"
          disabled={Object.keys(form.errors).length !== 0 || loading.stake}
          $loading={loading.stake}
        >
          Stake
        </Button>
      </FormItem>
      <FormItem>
        <div>
          <Button
            $fontSize="xs"
            $padding="lg"
            $borderRadius="xxl"
            onClick={() => end()}
            disabled={isUnstakeDisabled}
            type="button"
            $loading={!!loading.unstake}
          >
            Unstake all
          </Button>
        </div>
      </FormItem>
      {isUnstakeLocked && (
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
              width="1.5rem"
              height="1.5rem"
              style={{ marginTop: '1.5rem' }}
            />
          </div>
        </DarkTooltip>
      )}
    </FormWrap>
  )
}
