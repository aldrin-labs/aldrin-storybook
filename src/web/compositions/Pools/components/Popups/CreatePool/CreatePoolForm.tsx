import { Button } from '@sb/components/Button'
import { CheckboxField, GroupLabel, RadioGroupField } from '@sb/components/FormElements'
import { InputField, INPUT_FORMATTERS, Input } from '@sb/components/Input'
import { ModalTitleBlock } from '@sb/components/Modal'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText, Text } from '@sb/components/Typography'
import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { TokenInfo } from '@sb/dexUtils/types'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { FlexBlock } from '@sb/components/Layout'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import {
  Body,
  CheckboxWrap, CoinSelectors,
  CoinWrap,

  NumberInput,
  Error, Footer,
  Slash,
  Title,
  InputAppendContainer,
  Centered,
  NumberInputField,
  TokensAvailableText,
} from './styles'
import { CreatePoolFormType } from './types'
import { validateNumber, TokenAmountInput } from './TokenAmountInput'

interface CreatePoolProps {
  onClose: () => void
  userTokens: TokenInfo[]
  pools: (Pool | PoolV2)[]
}

const steps = [
  'Set up a Pool',
  'Add Initial Liquidity',
  'Set Up Farming',
  'Confirm Pool Creation',
]


export const CreatePoolForm: React.FC<CreatePoolProps> = (props) => {
  const { onClose, userTokens, pools } = props
  const [step, setStep] = useState(2)
  const stepsSize = steps.length


  const tokens: Token[] = userTokens.map((ut) => ({
    mint: ut.mint,
    account: ut.address,
    balance: ut.amount,
  }))
    .sort((a, b) => a.mint.localeCompare(b.mint))


  const form = useFormik<CreatePoolFormType>({
    validateOnMount: true,
    initialValues: {
      baseToken: tokens[0],
      quoteToken: tokens[1],
      stableCurve: false,
      lockInitialLiquidity: false,
      initialLiquidityLockPeriod: 0,
      firstDeposit: {
        baseTokenAmount: 0,
        quoteTokenAmount: 0,
      },
      farmingEnabled: true,
      farming: {
        token: tokens[0],
        vestingEnabled: false,
        tokenAmount: 0,
        farmingPeriod: 14,
      }
    },
    onSubmit: async (values) => {
      console.log('Values', values)
    },
    validate: (values) => {
      const { baseToken: { mint: baseTokenMint }, quoteToken: { mint: quoteTokenMint } } = values

      if (baseTokenMint === quoteTokenMint) {
        return { 'baseToken': 'Same token selected' }
      }

      const pool = pools.find((p) => {
        const poolBaseMint = p.baseTokenMint.toBase58()
        const poolQuoteMint = p.quoteTokenMint.toBase58()

        return (poolBaseMint === baseTokenMint && poolQuoteMint === quoteTokenMint) ||
          (poolBaseMint === quoteTokenMint && poolQuoteMint === baseTokenMint)
      })

      if (pool) {
        return { 'baseToken': 'Such a pool already exists and cannot be duplicated.  You can contact the Aldrin team for further information.' }
      }

      if (values.lockInitialLiquidity && !(values.initialLiquidityLockPeriod > 0)) {
        return { 'initialLiquidityLockPeriod': 'Please enter a valid days duration.' }
      }

      return
    },
  })


  const selectedBaseAccount = userTokens.find((ut) => ut.address === form.values.baseToken.account)
  const selectedQuoteAccount = userTokens.find((ut) => ut.address === form.values.quoteToken.account)
  const farmingRewardAccount = userTokens.find((ut) => ut.address === form.values.farming.token.account)


  if (!farmingRewardAccount) {
    return null
  }

  if (!selectedBaseAccount) {
    return null
  }

  if (!selectedQuoteAccount) {
    return null
  }

  const options = [
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ]

  const isLastStep = step === stepsSize
  const prevStep = () => {
    if (step !== 1) {
      setStep(step - 1)
    }
  }
  const nextStep = () => {
    if (!isLastStep) {
      setStep(step + 1)

      // Validate next step after render
      setTimeout(() => form.validateForm())
    }
  }

  const price = (form.values.firstDeposit.quoteTokenAmount / form.values.firstDeposit.baseTokenAmount) || 0

  return (
    <>
      <ModalTitleBlock
        title={

          isLastStep ?
            <Title>{steps[step - 1]}</Title> :

            <Title>
              Step {step}/3 <span>{steps[step - 1]}</span>
            </Title>
        }
        onClose={onClose}
      />
      <Body>
        <FormikProvider value={form}>
          <form onSubmit={form.handleSubmit}>
            {step === 1 &&
              <>
                <CoinSelectors>
                  <CoinWrap>
                    <TokenSelectorField tokens={tokens} label="Select Base Token" name="baseToken" />
                  </CoinWrap>
                  <Slash>/</Slash>
                  <CoinWrap>
                    <TokenSelectorField tokens={tokens} label="Select Quote Token" name="quoteToken" />
                  </CoinWrap>
                </CoinSelectors>
                {form.errors['baseToken'] &&
                  <Error color="error">{form.errors['baseToken']}</Error>
                }
                <CheckboxWrap>

                  <CheckboxField
                    label="Use Stable Curve for this pool. ATTENTION, ADVANCED USERS ONLY."
                    name="stableCurve"
                    color="error"
                  />

                  <DarkTooltip
                    title="Stable pools are designed specifically for pegged assets that trade at a similar price. e.g. mSOL/SOL (SOL-pegged), USDC/USDT (USD-pegged) etc."
                  >
                    <InlineText color="success" size="sm">What is stable curve?</InlineText>
                  </DarkTooltip>
                </CheckboxWrap>

                <GroupLabel label="Do you want to lock your initial liquidity for some time?"></GroupLabel>
                <CheckboxWrap>
                  <RadioGroupField
                    options={options}
                    name="lockInitialLiquidity"
                  />

                  <div>
                    <NumberInputField
                      borderRadius="lg"
                      variant="outline"
                      name="initialLiquidityLockPeriod"
                      append={
                        <InputAppendContainer>
                          <InlineText color="primaryWhite" weight={600}>Days</InlineText>
                        </InputAppendContainer>
                      }
                      formatter={INPUT_FORMATTERS.DECIMAL}
                      disabled={!form.values.lockInitialLiquidity}
                    />
                    {form.errors['initialLiquidityLockPeriod'] &&
                      <Error color="error">{form.errors['initialLiquidityLockPeriod']}</Error>
                    }
                  </div>


                </CheckboxWrap>

              </>
            }
            {
              step === 2 &&
              <>
                <GroupLabel label="Set Base Token initial price"></GroupLabel>
                <FlexBlock>
                  <FlexBlock alignItems="center">
                    <InlineText color="success" weight={600}>1&nbsp;</InlineText>
                    <TokenIconWithName mint={form.values.baseToken.mint} /> &nbsp;=
                  </FlexBlock>

                  <NumberInput
                    name="price"
                    value={`${price}`}
                    onChange={() => { }}
                    disabled
                    borderRadius="lg"
                    variant="outline"
                    append={
                      <InputAppendContainer>
                        <TokenIconWithName mint={form.values.quoteToken.mint} />
                      </InputAppendContainer>
                    }
                  />

                </FlexBlock>
                <br />
                <GroupLabel label="Add Initial Liquidity"></GroupLabel>
                <Centered>
                  <TokenAmountInput
                    name="firstDeposit.baseTokenAmount"
                    setFieldValue={form.setFieldValue}
                    available={selectedBaseAccount.amount}
                    mint={form.values.baseToken.mint}
                  />
                  <Centered>+</Centered>
                  <TokenAmountInput
                    name="firstDeposit.quoteTokenAmount"
                    setFieldValue={form.setFieldValue}
                    available={selectedQuoteAccount.amount}
                    mint={form.values.quoteToken.mint}
                  />
                </Centered>
              </>
            }
            {
              step === 3 &&
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
                <GroupLabel label="Specify the amount of tokens you want to allocate to farming"></GroupLabel>
                <TokenAmountInput
                  name="farming.tokenAmount"
                  setFieldValue={form.setFieldValue}
                  available={farmingRewardAccount.amount}
                  mint={form.values.farming.token.mint}
                />
                <CoinSelectors>
                  <InputField
                    borderRadius="lg"
                    variant="outline"
                    name="farming.farmingPeriod"
                    append={
                      <InputAppendContainer>
                        <InlineText color="primaryWhite" weight={600}>Days</InlineText>
                      </InputAppendContainer>
                    }
                    formatter={INPUT_FORMATTERS.DECIMAL}
                  />

                  <NumberInput
                    name="price"
                    value={`${price}`}
                    onChange={() => { }}
                    disabled
                    borderRadius="lg"
                    variant="outline"
                    append={
                      <InputAppendContainer>
                        <TokenIconWithName mint={form.values.farming.token.mint} />
                      </InputAppendContainer>
                    }
                  />
                </CoinSelectors>
                <CheckboxWrap>
                  <div>
                    <GroupLabel label="Do you want to set up vesting?"></GroupLabel>
                    <RadioGroupField
                      options={options}
                      name="farming.vestingEnabled"
                    />
                  </div>
                  <div>
                    <GroupLabel label="The rest will be paid once per"></GroupLabel>

                    <NumberInputField
                      borderRadius="lg"
                      variant="outline"
                      name="farming.vestingPeriod"
                      append={
                        <InputAppendContainer>
                          <InlineText color="primaryWhite" weight={600}>Days</InlineText>
                        </InputAppendContainer>
                      }
                      formatter={INPUT_FORMATTERS.DECIMAL}
                      disabled={!form.values.lockInitialLiquidity}
                    />
                    {form.errors['initialLiquidityLockPeriod'] &&
                      <Error color="error">{form.errors['initialLiquidityLockPeriod']}</Error>
                    }
                  </div>


                </CheckboxWrap>
              </>
            }


            <Footer>
              {step === 1 ?
                <Button $variant="outline-white">Cancel</Button> :
                <Button $variant="outline-white" onClick={prevStep}>Back</Button>
              }

              {step === 3 &&
                <Button $variant="outline-white" onClick={nextStep}>Skip</Button>
              }
              {isLastStep ?
                <Button type="submit">Create Pool</Button> :
                <Button
                  type="button"
                  disabled={!form.isValid}
                  onClick={nextStep}
                >
                  Next
                </Button>
              }
            </Footer>
          </form>
        </FormikProvider>
      </Body>
    </>
  )
}