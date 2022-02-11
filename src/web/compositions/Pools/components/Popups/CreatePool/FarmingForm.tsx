import dayjs from 'dayjs'
import { useFormikContext } from 'formik'
import React from 'react'

import { GroupLabel, RadioGroupField } from '@sb/components/FormElements'
import { InputField, INPUT_FORMATTERS, Input } from '@sb/components/Input'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { InlineText } from '@sb/components/Typography'
import { TokenInfo } from '@sb/dexUtils/types'

import { DAY } from '@core/utils/dateUtils'

import {
  CoinSelectors,
  CoinWrap,
  NumberInputContainer,
  InputAppendContainer,
  CheckboxWrap,
  RadioGroupContainer,
  ErrorText,
} from './styles'
import { TokenAmountInputField, TokenAmountInput } from './TokenAmountInput'
import { FarmingFormType } from './types'

interface FarmingFormProps {
  tokens: Token[]
  userTokens: TokenInfo[]
  farmingRewardFormatted: string
}

export const YES_NO = [
  { label: 'No', value: false },
  { label: 'Yes', value: true },
]

const resolveFarmingAvailableAmount = (
  userTokens: TokenInfo[],
  formValues: FarmingFormType
) => {
  const {
    baseToken,
    quoteToken,
    farming: { token: farmingToken },
    firstDeposit,
  } = formValues

  if (farmingToken.account === baseToken?.account) {
    const totalBalance =
      userTokens.find((ut) => ut.address === baseToken?.account)?.amount || 0
    return Math.max(
      totalBalance - parseFloat(firstDeposit?.baseTokenAmount || '0'),
      0
    )
  }

  if (farmingToken.account === quoteToken?.account) {
    const totalBalance =
      userTokens.find((ut) => ut.address === quoteToken?.account)?.amount || 0
    return Math.max(
      totalBalance - parseFloat(firstDeposit?.quoteTokenAmount || '0'),
      0
    )
  }

  return (
    userTokens.find((ut) => ut.address === farmingToken.account)?.amount ||
    farmingToken.balance ||
    0
  )
}

export const FarmingForm: React.FC<FarmingFormProps> = (props) => {
  const { tokens, userTokens, farmingRewardFormatted } = props
  const form = useFormikContext<FarmingFormType>()
  const {
    values: { farming },
  } = form
  const farmingEndDate =
    Date.now() + parseFloat(farming.farmingPeriod) * DAY * 1000 // to ms
  return (
    <>
      <CoinSelectors>
        <CoinWrap>
          <TokenSelectorField
            tokens={tokens}
            label="Choose the token you want to give to the farming"
            name="farming.token"
          />
        </CoinWrap>
      </CoinSelectors>
      <GroupLabel label="Specify the amount of tokens you want to allocate to farming" />
      <TokenAmountInputField
        name="farming.tokenAmount"
        setFieldValue={form.setFieldValue}
        available={resolveFarmingAvailableAmount(userTokens, form.values)}
        mint={form.values.farming.token.mint}
      />
      {form.errors.farming?.tokenAmount &&
        form.touched.farming?.tokenAmount && (
          <ErrorText color="error">{form.errors.farming.tokenAmount}</ErrorText>
        )}
      <br />
      <CoinSelectors>
        <NumberInputContainer>
          <GroupLabel label="Specify the farming period" />
          <InputField
            borderRadius="lg"
            variant="outline"
            name="farming.farmingPeriod"
            append={
              <InputAppendContainer>
                <InlineText color="primaryWhite" weight={600}>
                  Days
                </InlineText>
              </InputAppendContainer>
            }
            formatter={INPUT_FORMATTERS.DECIMAL}
          />
        </NumberInputContainer>
        <NumberInputContainer>
          <GroupLabel label="Estimated reward per day" />
          <TokenAmountInput
            name="farming.tokenDayReward"
            value={farmingRewardFormatted}
            mint={form.values.farming.token.mint}
          />
        </NumberInputContainer>
      </CoinSelectors>
      <InlineText color="hint" size="sm" weight={600}>
        Farming will end at {dayjs(farmingEndDate).format('HH:mm MMM DD, YYYY')}
      </InlineText>
      <br />
      <br />
      <CheckboxWrap>
        <RadioGroupContainer>
          <div>
            <GroupLabel label="Do you want to set up vesting?" />
            <RadioGroupContainer>
              <RadioGroupField options={YES_NO} name="farming.vestingEnabled" />
            </RadioGroupContainer>
          </div>
        </RadioGroupContainer>
        <div>
          <GroupLabel label="Daily rewards" />
          <Input
            onChange={() => {}}
            disabled
            borderRadius="lg"
            variant="outline"
            name="initialLiquidityLockPeriod"
            append={
              <InputAppendContainer>
                <InlineText color="primaryWhite" weight={600}>
                  % per Day
                </InlineText>
              </InputAppendContainer>
            }
            value="33.3"
          />
        </div>
        <div>
          <GroupLabel label="The rest will be paid after" />
          <InputField
            borderRadius="lg"
            variant="outline"
            name="farming.vestingPeriod"
            disabled={!farming.vestingEnabled}
            append={
              <InputAppendContainer>
                <InlineText color="primaryWhite" weight={600}>
                  Days
                </InlineText>
              </InputAppendContainer>
            }
            formatter={INPUT_FORMATTERS.NATURAL}
          />
          {form.errors.farming?.vestingPeriod &&
            form.touched.farming?.vestingPeriod && (
              <ErrorText color="error">
                {form.errors.farming?.vestingPeriod}
              </ErrorText>
            )}
        </div>
      </CheckboxWrap>
    </>
  )
}
