import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'
import { Button } from '@sb/components/Button'
import { CheckboxField, GroupLabel, RadioGroupField } from '@sb/components/FormElements'
import { InputField, INPUT_FORMATTERS } from '@sb/components/Input'
import { FlexBlock } from '@sb/components/Layout'
import { ModalTitleBlock } from '@sb/components/Modal'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { createPoolTransactions, CURVE } from '@sb/dexUtils/pools/actions/createPool'
import { sendAndWaitSignedTransaction } from '@sb/dexUtils/send'
import { TokenInfo } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { FarmingForm, YES_NO } from './FarmingForm'
import { PoolConfirmationData } from './PoolConfirmationData'
import { PoolProcessingModal, TransactionStatus } from './PoolProcessingModal'
import {
  Body,
  Centered,
  CheckboxWrap,
  CoinSelectors,
  CoinWrap,
  Error, Footer,
  InputAppendContainer, NumberInputContainer,
  RadioGroupContainer,
  Slash,
  Title
} from './styles'
import { TokenAmountInput, TokenAmountInputField } from './TokenAmountInput'
import { CreatePoolFormType } from './types'

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

interface EventLike {
  preventDefault: () => void
}

const STABLE_POOLS_TOOLTIP = "Stable pools are designed specifically for pegged assets that trade at a similar price. e.g. mSOL/SOL (SOL-pegged), USDC/USDT (USD-pegged) etc."

export const CreatePoolForm: React.FC<CreatePoolProps> = (props) => {
  const { onClose, userTokens, pools } = props
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<TransactionStatus>('processing')
  const [processingStep, setProcessingStep] = useState(0)
  const stepsSize = steps.length


  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

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
      initialLiquidityLockPeriod: '0',
      firstDeposit: {
        baseTokenAmount: '0',
        quoteTokenAmount: '0',
      },
      farmingEnabled: true,
      farming: {
        token: tokens[0],
        vestingEnabled: true,
        tokenAmount: '0',
        farmingPeriod: '14',
        vestingPeriod: '7',
      }
    },
    onSubmit: async (values) => {
      setProcessing(true)
      setProcessingStatus('processing')
      setProcessingStep(0)

      const selectedBaseAccount = userTokens.find((ut) => ut.address === values.baseToken.account)
      const selectedQuoteAccount = userTokens.find((ut) => ut.address === values.quoteToken.account)
      const farmingRewardAccount = userTokens.find((ut) => ut.address === values.farming.token.account)

      const tokensPerPeriod = parseFloat(values.farming.tokenAmount) * HOUR / DAY / parseFloat(values.farming.farmingPeriod)

      const tokensMultiplier = 10 ** (farmingRewardAccount?.decimals || 0)
      try {
        const generatedTransactions = await createPoolTransactions({
          wallet,
          connection,
          baseTokenMint: new PublicKey(values.baseToken.mint),
          quoteTokenMint: new PublicKey(values.quoteToken.mint),
          firstDeposit: {
            baseTokenAmount: new BN(parseFloat(values.firstDeposit.baseTokenAmount) * 10 ** (selectedBaseAccount?.decimals || 0)),
            userBaseTokenAccount: new PublicKey(values.baseToken.account || ''),
            quoteTokenAmount: new BN(parseFloat(values.firstDeposit.quoteTokenAmount) * 10 ** (selectedQuoteAccount?.decimals || 0)),
            userQuoteTokenAccount: new PublicKey(values.quoteToken.account || ''),
          },
          farming: values.farmingEnabled ? {
            farmingTokenMint: new PublicKey(values.farming.token.mint),
            farmingTokenAccount: new PublicKey(values.farming.token.account || ''),
            tokenAmount: new BN(parseFloat(values.farming.tokenAmount) * tokensMultiplier),
            periodLength: new BN(HOUR),
            tokensPerPeriod: new BN(tokensPerPeriod * tokensMultiplier),
            noWithdrawPeriodSeconds: new BN(0),
            vestingPeriodSeconds: values.farming.vestingEnabled ?
              new BN((parseFloat(values.farming.vestingPeriod || '0')) * DAY) : new BN(0),
          } : undefined,
          curveType: values.stableCurve ? CURVE.STABLE : CURVE.PRODUCT,
        })


        setProcessingStep(1)
        console.log('Create accounts...')
        const createAccountsTxId = await sendAndWaitSignedTransaction(generatedTransactions.createAccounts, connection)
        console.log('createAccountsTxId: ', createAccountsTxId)

        setProcessingStep(2)
        console.log('Set authorities...')
        const setAuthoritiesTxId = await sendAndWaitSignedTransaction(generatedTransactions.setAuthorities, connection)
        console.log('setAuthoritiesTxId: ', setAuthoritiesTxId)

        console.log('Initialize pool...')
        setProcessingStep(3)
        const initPoolTxId = await sendAndWaitSignedTransaction(generatedTransactions.createPool, connection)
        console.log('initPoolTxId: ', initPoolTxId)


        console.log('First deposit...')
        setProcessingStep(4)
        const firstDepositTxId = await sendAndWaitSignedTransaction(generatedTransactions.firstDeposit, connection)
        console.log('firstDepositTxId: ', firstDepositTxId)


        if (generatedTransactions.farming) {
          console.log('Initialize farming...')
          setProcessingStep(5)
          const farmingTxId = await sendAndWaitSignedTransaction(generatedTransactions.farming, connection)
          console.log('firstDepositTxId: ', farmingTxId)
        }

        setProcessingStep(-1)
        setProcessingStatus('success')
      } catch (e) {
        console.error('Unable to create pool: ', e)
        setProcessingStatus('error')
      }
    },
    validate: async (values) => {
      const { baseToken: { mint: baseTokenMint }, quoteToken: { mint: quoteTokenMint } } = values

      if (baseTokenMint === quoteTokenMint) {
        return { baseToken: 'Same token selected' }
      }

      const pool = pools.find((p) => {
        const poolBaseMint = p.baseTokenMint.toBase58()
        const poolQuoteMint = p.quoteTokenMint.toBase58()

        return (poolBaseMint === baseTokenMint && poolQuoteMint === quoteTokenMint) ||
          (poolBaseMint === quoteTokenMint && poolQuoteMint === baseTokenMint)
      })

      if (pool) {
        return { baseToken: 'Such a pool already exists and cannot be duplicated.  You can contact the Aldrin team for further information.' }
      }

      if (values.lockInitialLiquidity && !(parseFloat(values.initialLiquidityLockPeriod) > 0)) {
        return { initialLiquidityLockPeriod: 'Please enter a valid lock duration.' }
      }

      if (values.farming.vestingEnabled && !((parseFloat(values.farming.vestingPeriod || '0')) > 0)) {
        return { farming: { vestingPeriod: 'Please enter a valid vesting period.' } }
      }

      return
    },
  })

  const { values, values: { firstDeposit, farming } } = form
  const farmingRewardPerDay = parseFloat(farming.farmingPeriod) > 0 ?
    parseFloat(farming.tokenAmount) / parseFloat(farming.farmingPeriod) : 0
  const farmingRewardFormatted = stripByAmount(farmingRewardPerDay)

  const selectedBaseAccount = userTokens.find((ut) => ut.address === values.baseToken.account)
  const selectedQuoteAccount = userTokens.find((ut) => ut.address === values.quoteToken.account)
  const farmingRewardAccount = userTokens.find((ut) => ut.address === values.farming.token.account)


  if (!farmingRewardAccount) {
    return null
  }

  if (!selectedBaseAccount) {
    return null
  }

  if (!selectedQuoteAccount) {
    return null
  }

  const isLastStep = step === stepsSize
  const prevStep = (e: EventLike) => {
    if (step !== 1) {
      setStep(step - 1)
    }
    e.preventDefault()
    return false
  }
  const nextStep = (e: EventLike, farmingEnabled = true) => {
    if (!isLastStep) {
      const nextStep = step + 1
      if (nextStep === stepsSize) { // last step
        form.setFieldValue('farmingEnabled', farmingEnabled)
      }
      setStep(step + 1)

      // Validate next step after render
      setTimeout(() => form.validateForm())
    }
    e.preventDefault()
    return false
  }


  const { quoteTokenAmount, baseTokenAmount } = firstDeposit
  const price = parseFloat(quoteTokenAmount) > 0 && parseFloat(baseTokenAmount) > 0 ?
    (parseFloat(quoteTokenAmount) / parseFloat(baseTokenAmount))
    : 0

  const priceFormatted = stripByAmount(price)
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
                {form.errors.baseToken &&
                  <Error color="error">{form.errors.baseToken}</Error>
                }
                <CheckboxWrap>

                  <CheckboxField
                    label="Use Stable Curve for this pool. ATTENTION, ADVANCED USERS ONLY."
                    name="stableCurve"
                    color="error"
                  />

                  <DarkTooltip
                    title={STABLE_POOLS_TOOLTIP}
                  >
                    <InlineText color="success" size="sm">What is stable curve?</InlineText>
                  </DarkTooltip>
                </CheckboxWrap>

                <GroupLabel label="Do you want to lock your initial liquidity for some time?"></GroupLabel>
                <CheckboxWrap>
                  <RadioGroupContainer>
                    <RadioGroupField
                      options={YES_NO}
                      name="lockInitialLiquidity"
                    />
                  </RadioGroupContainer>
                  <div>
                    <InputField
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
                    {form.errors.initialLiquidityLockPeriod && form.touched.initialLiquidityLockPeriod &&
                      <Error color="error">{form.errors.initialLiquidityLockPeriod}</Error>
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
                  <NumberInputContainer>
                    <TokenAmountInput
                      name="price"
                      value={priceFormatted}
                      mint={form.values.quoteToken.mint}
                    />
                  </NumberInputContainer>
                </FlexBlock>
                <br />
                <GroupLabel label="Add Initial Liquidity"></GroupLabel>
                <Centered>
                  <TokenAmountInputField
                    name="firstDeposit.baseTokenAmount"
                    setFieldValue={form.setFieldValue}
                    available={selectedBaseAccount.amount}
                    mint={form.values.baseToken.mint}
                  />
                </Centered>

                {form.errors.firstDeposit?.baseTokenAmount && form.touched.firstDeposit?.baseTokenAmount &&
                  <Error color="error">{form.errors.firstDeposit.baseTokenAmount}</Error>
                }
                <Centered>+</Centered>
                <Centered>
                  <TokenAmountInputField
                    name="firstDeposit.quoteTokenAmount"
                    setFieldValue={form.setFieldValue}
                    available={selectedQuoteAccount.amount}
                    mint={form.values.quoteToken.mint}
                  />
                </Centered>
                {form.errors.firstDeposit?.quoteTokenAmount && form.touched.firstDeposit?.quoteTokenAmount &&
                  <Error color="error">{form.errors.firstDeposit.quoteTokenAmount}</Error>
                }

              </>
            }
            {
              step === 3 &&
              <FarmingForm
                farmingRewardFormatted={farmingRewardFormatted}
                tokens={tokens}
                userTokens={userTokens}
              />
            }
            {step === 4 &&
              <PoolConfirmationData
                values={values}
                price={priceFormatted}
                farmingRewardPerDay={farmingRewardFormatted}
              />
            }

            <Footer>
              {step === 1 ?
                <Button $padding="lg" type="button" onClick={onClose} $variant="outline-white">Cancel</Button> :
                <Button $padding="lg" $variant="outline-white" onClick={prevStep}>Back</Button>
              }

              {step === 3 &&
                <Button type="button" $padding="lg" $variant="outline-white" onClick={(e) => {
                  nextStep(e, false)
                }}>Skip</Button>
              }
              {isLastStep ?
                <Button type="submit">Create Pool</Button> :
                <Button
                  $padding="lg"
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
        {processing &&
          <PoolProcessingModal
            status={processingStatus}
            step={processingStep}
            onClose={() => {
              setProcessing(false)
              onClose()
            }} />
        }
      </Body>
    </>
  )
}