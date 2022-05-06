import { PublicKey } from '@solana/web3.js'
import { ApolloQueryResult } from 'apollo-client'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { useHistory } from 'react-router'

import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { GroupLabel, RadioGroupField } from '@sb/components/FormElements'
import { InputField, INPUT_FORMATTERS } from '@sb/components/Input'
import { FlexBlock } from '@sb/components/Layout'
import { ModalTitleBlock } from '@sb/components/Modal'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { InlineText } from '@sb/components/Typography'
import { useConnection } from '@sb/dexUtils/connection'
import {
  ALL_TOKENS_MINTS_MAP,
  getTokenNameByMintAddress,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { createPoolTransactions } from '@sb/dexUtils/pools/actions/createPool'
import { CURVE } from '@sb/dexUtils/pools/types'
import { sendSignedSignleTransaction } from '@sb/dexUtils/transactions'
import {
  formatNumbersForState,
  formatNumberWithSpaces,
  sleep,
} from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'

import AttentionIcon from '@icons/attentionWhite.svg'
import CrownIcon from '@icons/crownIcon.svg'

import { PoolInfo } from '../../../index.types'
import { FarmingForm, YES_NO } from './FarmingForm'
import { PoolConfirmationData } from './PoolConfirmationData'
import { PoolProcessingModal, TransactionStatus } from './PoolProcessingModal'
import {
  Body,
  ButtonContainer,
  Centered,
  CheckboxWrap,
  CoinSelectors,
  CoinWrap,
  ErrorText,
  Footer,
  InputAppendContainer,
  NumberInputContainer,
  RadioGroupContainer,
  Slash,
  Title,
  VestingExplanation,
} from './styles'
import { TokenAmountInputField } from './TokenAmountInput'
import { CreatePoolFormType, CreatePoolFormProps } from './types'

const steps = [
  'Set up a Pool',
  'Add Initial Liquidity',
  'Set Up Farming',
  'Confirm Pool Creation',
]

interface EventLike {
  preventDefault: () => void
}

const checkPoolCreated = async (
  pool: PublicKey,
  refetch: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>,
  retries = 20
): Promise<PoolInfo | null> => {
  if (retries === 0) {
    return null
  }
  const poolStr = pool.toBase58()
  const data = await refetch()

  const {
    data: { getPoolsInfo },
  } = data
  const createdPool = getPoolsInfo.find((p) => p.swapToken === poolStr)
  if (!createdPool) {
    await sleep(20_000)
    return checkPoolCreated(pool, refetch, retries - 1)
  }
  return createdPool
}

const USDC_MINT = ALL_TOKENS_MINTS_MAP.USDC.toString()
const SOL_WRAP_MINT = ALL_TOKENS_MINTS_MAP.SOL.toString()
// Try to set SOL, otherwise - any
const findBaseToken = (tokens: Token[]): Token => {
  const sol = tokens.find((t) => t.mint === SOL_WRAP_MINT)
  if (sol) {
    return sol
  }
  return tokens[1]
}

// Try to set USDC, otherwise - Sol
const findQuoteToken = (tokens: Token[]): Token => {
  const usdc = tokens.find((t) => t.mint === USDC_MINT)
  if (usdc) {
    return usdc
  }
  const sol = tokens.find((t) => t.mint === SOL_WRAP_MINT)
  if (sol) {
    return sol
  }
  return tokens[1]
}

export const CreatePoolForm: React.FC<CreatePoolFormProps> = (props) => {
  const { onClose, userTokens, pools, refetchPools, dexTokensPricesMap } = props
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] =
    useState<TransactionStatus>('processing')
  const [processingStep, setProcessingStep] = useState(0)
  const [priceTouched, setPriceTouched] = useState(false)
  const stepsSize = steps.length

  const { wallet } = useWallet()
  const connection = useConnection()
  const history = useHistory()

  const tokens: Token[] = userTokens
    .map((ut) => ({
      mint: ut.mint,
      account: ut.address,
      balance: ut.amount,
    }))
    .sort((a, b) => a.mint.localeCompare(b.mint))

  const [initialValues] = useState<CreatePoolFormType>({
    price: '',
    baseToken: findBaseToken(tokens),
    quoteToken: findQuoteToken(tokens),
    stableCurve: false,
    lockInitialLiquidity: false,
    initialLiquidityLockPeriod: '',
    firstDeposit: {
      baseTokenAmount: '',
      quoteTokenAmount: '',
    },
    farmingEnabled: true,
    farming: {
      token: tokens[0],
      vestingEnabled: false,
      tokenAmount: '',
      farmingPeriod: '14',
      vestingPeriod: '7',
    },
  })
  const form = useFormik<CreatePoolFormType>({
    validateOnMount: true,
    initialValues,
    onSubmit: async (values) => {
      if (!values.baseToken) {
        throw new Error('No base token selected!')
      }
      if (!values.baseToken.account) {
        throw new Error('No base token selected!')
      }
      if (!values.quoteToken) {
        throw new Error('No quote token selected!')
      }
      if (!values.quoteToken.account) {
        throw new Error('No quote token selected!')
      }
      setProcessing(true)
      setProcessingStatus('processing')
      setProcessingStep(0)

      const selectedBaseAccount = userTokens.find(
        (ut) => ut.address === values.baseToken.account
      )
      const selectedQuoteAccount = userTokens.find(
        (ut) => ut.address === values.quoteToken.account
      )
      const farmingRewardAccount = userTokens.find(
        (ut) => ut.address === values.farming.token.account
      )

      const tokensPerPeriod =
        (parseFloat(values.farming.tokenAmount) * HOUR) /
        DAY /
        parseFloat(values.farming.farmingPeriod)

      const tokensMultiplier = 10 ** (farmingRewardAccount?.decimals || 0)
      try {
        const { transactions: generatedTransactions, pool } =
          await createPoolTransactions({
            wallet,
            connection,
            baseTokenMint: new PublicKey(values.baseToken.mint),
            quoteTokenMint: new PublicKey(values.quoteToken.mint),
            firstDeposit: {
              baseTokenAmount: new BN(
                (
                  parseFloat(values.firstDeposit.baseTokenAmount) *
                  10 ** (selectedBaseAccount?.decimals || 0)
                ).toFixed(0)
              ),
              userBaseTokenAccount: new PublicKey(values.baseToken.account),
              quoteTokenAmount: new BN(
                (
                  parseFloat(values.firstDeposit.quoteTokenAmount) *
                  10 ** (selectedQuoteAccount?.decimals || 0)
                ).toFixed(0)
              ),
              userQuoteTokenAccount: new PublicKey(values.quoteToken.account),
              vestingPeriod: values.lockInitialLiquidity
                ? new BN(values.initialLiquidityLockPeriod).muln(DAY)
                : undefined,
            },
            farming:
              values.farmingEnabled && values.farming.token.account
                ? {
                    farmingTokenMint: new PublicKey(values.farming.token.mint),
                    farmingTokenAccount: new PublicKey(
                      values.farming.token.account
                    ),
                    tokenAmount: new BN(
                      (
                        parseFloat(values.farming.tokenAmount) *
                        tokensMultiplier
                      ).toFixed(0)
                    ),
                    periodLength: new BN(HOUR),
                    tokensPerPeriod: new BN(
                      (tokensPerPeriod * tokensMultiplier).toFixed(0)
                    ),
                    noWithdrawPeriodSeconds: new BN(0),
                    vestingPeriodSeconds: values.farming.vestingEnabled
                      ? new BN(
                          parseFloat(values.farming.vestingPeriod || '0') * DAY
                        )
                      : new BN(0),
                  }
                : undefined,
            curveType: values.stableCurve ? CURVE.STABLE : CURVE.PRODUCT,
          })

        // Send transactions one by one

        setProcessingStep(1)
        console.log('Create accounts...')
        const createAccountsTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.createAccounts,
          connection,
        })
        console.log('createAccountsTxId: ', createAccountsTxId)
        if (createAccountsTxId !== 'success') {
          throw new Error('createAccountsTxId failed')
        }
        await sleep(1000)

        setProcessingStep(2)
        console.log('Set authorities...')
        const setAuthoritiesTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.setAuthorities,
          connection,
        })
        if (setAuthoritiesTxId !== 'success') {
          throw new Error('setAuthoritiesTxId failed')
        }
        console.log('setAuthoritiesTxId: ', setAuthoritiesTxId)
        await sleep(1000)

        console.log('Initialize pool...')
        setProcessingStep(3)
        const initPoolTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.createPool,
          connection,
        })
        if (initPoolTxId !== 'success') {
          throw new Error('initPoolTxId failed')
        }
        console.log('initPoolTxId: ', initPoolTxId)
        await sleep(1000)

        console.log('First deposit...')
        setProcessingStep(4)
        const firstDepositTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.firstDeposit,
          connection,
        })
        if (firstDepositTxId !== 'success') {
          throw new Error('firstDepositTxId failed')
        }
        await sleep(1000)

        console.log('firstDepositTxId: ', firstDepositTxId)

        if (generatedTransactions.farming) {
          console.log('Initialize farming...')
          setProcessingStep(5)
          const farmingTxId = await sendSignedSignleTransaction({
            transaction: generatedTransactions.farming,
            connection,
          })
          if (farmingTxId !== 'success') {
            throw new Error('farmingTxId failed')
          }
          await sleep(1000)
          console.log('farmingTxId: ', farmingTxId)
        }

        setProcessingStep(6)

        // TODO: timeout?
        const createdPool = await checkPoolCreated(pool, refetchPools)

        setProcessingStep(-1)
        setProcessingStatus('success')

        notify({
          message: 'Pool succesfully created',
          type: 'success',
        })

        onClose()
        setTimeout(() => {
          if (createdPool) {
            history.push(`/pools/${createdPool.parsedName}`)
          }
        }, 100)
      } catch (e) {
        console.error('Unable to create pool: ', e)
        setProcessingStatus('error')
      }
    },
    validate: async (values) => {
      const {
        baseToken: { mint: baseTokenMint } = {},
        quoteToken: { mint: quoteTokenMint } = {},
      } = values

      if (!baseTokenMint) {
        return { baseToken: 'No token selected' }
      }
      if (!quoteTokenMint) {
        return { quoteToken: 'No token selected' }
      }

      const basePrice = dexTokensPricesMap.get(
        getTokenNameByMintAddress(baseTokenMint)
      )
      const quotePrice = dexTokensPricesMap.get(
        getTokenNameByMintAddress(quoteTokenMint)
      )

      if (!basePrice && !quotePrice) {
        return { baseToken: 'No price for selected tokens' }
      }

      if (baseTokenMint === quoteTokenMint) {
        return { baseToken: 'Same token selected' }
      }

      const pool = pools.find((p) => {
        const poolBaseMint = p.baseTokenMint.toBase58()
        const poolQuoteMint = p.quoteTokenMint.toBase58()

        return (
          (poolBaseMint === baseTokenMint &&
            poolQuoteMint === quoteTokenMint) ||
          (poolBaseMint === quoteTokenMint && poolQuoteMint === baseTokenMint)
        )
      })

      if (pool) {
        return {
          baseToken:
            'Such a pool already exists and cannot be duplicated.  You can contact the Aldrin team for further information.',
        }
      }

      return null
    },
  })

  const {
    values,
    values: { firstDeposit, farming },
  } = form

  const farmingRewardPerDay =
    parseFloat(farming.farmingPeriod) > 0
      ? parseFloat(farming.tokenAmount) / parseFloat(farming.farmingPeriod)
      : 0

  const farmingRewardFormatted = stripByAmount(farmingRewardPerDay)

  const selectedBaseAccount = userTokens.find(
    (ut) => ut.address === values.baseToken?.account
  )
  const selectedQuoteAccount = userTokens.find(
    (ut) => ut.address === values.quoteToken?.account
  )
  const farmingRewardAccount = userTokens.find(
    (ut) => ut.address === values.farming.token?.account
  )

  const isLastStep = step === stepsSize
  const prevStep = (e: EventLike) => {
    if (step !== 1) {
      setStep(step - 1)
    }
    e.preventDefault()

    // Validate next step after render
    setTimeout(() => form.validateForm())

    return false
  }
  const nextStep = (e: EventLike, farmingEnabled = true) => {
    if (!isLastStep) {
      if (stepsSize === step + 1) {
        // last step
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
  const price =
    parseFloat(quoteTokenAmount) > 0 && parseFloat(baseTokenAmount) > 0
      ? parseFloat(quoteTokenAmount) / parseFloat(baseTokenAmount)
      : 0

  const priceFormatted = stripByAmount(price)

  const onBaseAmountChange = (value: string) => {
    form.setFieldValue(
      'firstDeposit.baseTokenAmount',
      formatNumbersForState(value)
    )

    const quoteValueForState = formatNumbersForState(value)
    const priceValueForState = formatNumbersForState(values.price)

    if (values.stableCurve) {
      form.setFieldValue('firstDeposit.quoteTokenAmount', quoteValueForState)
    } else if (priceTouched) {
      const userDefinedPrice = parseFloat(priceValueForState || '1')
      const newQuoteAmount = parseFloat(quoteValueForState) * userDefinedPrice

      if (newQuoteAmount) {
        form.setFieldValue('firstDeposit.quoteTokenAmount', newQuoteAmount)
        form.setTouched({ firstDeposit: { quoteTokenAmount: true } })
      }
    } else {
      const newPrice =
        parseFloat(
          formatNumbersForState(values.firstDeposit.quoteTokenAmount)
        ) / parseFloat(quoteValueForState)

      if (newPrice) {
        form.setFieldValue('price', stripByAmount(newPrice))
      }
    }

    setTimeout(() => form.validateForm())
  }

  const onQuoteAmountChange = (value: string) => {
    form.setFieldValue(
      'firstDeposit.quoteTokenAmount',
      formatNumbersForState(value)
    )

    const baseValueForState = formatNumbersForState(value)
    const priceValueForState = formatNumbersForState(values.price)

    if (values.stableCurve) {
      form.setFieldValue('firstDeposit.baseTokenAmount', baseValueForState)
    } else if (priceTouched) {
      const userDefinedPrice = parseFloat(priceValueForState || '1')
      const newBaseAmount = parseFloat(baseValueForState) / userDefinedPrice
      if (newBaseAmount) {
        form.setFieldValue('firstDeposit.baseTokenAmount', newBaseAmount)
        form.setTouched({ firstDeposit: { baseTokenAmount: true } })
      }
    } else {
      const newPrice =
        parseFloat(baseValueForState) /
        parseFloat(formatNumbersForState(values.firstDeposit.baseTokenAmount))
      if (newPrice) {
        form.setFieldValue('price', stripByAmount(newPrice))
      }
    }

    setTimeout(() => form.validateForm())
  }

  return (
    <>
      <ModalTitleBlock
        title={
          <Title>
            {isLastStep ? (
              steps[step - 1]
            ) : (
              <>
                Step {step}/3 <span>{steps[step - 1]}</span>
              </>
            )}
          </Title>
        }
        onClose={onClose}
      />
      <Body>
        <FormikProvider value={form}>
          <form onSubmit={form.handleSubmit}>
            {step === 1 && (
              <>
                <CoinSelectors>
                  <CoinWrap>
                    <TokenSelectorField
                      tokens={tokens}
                      label="Select Base Token"
                      name="baseToken"
                    />
                  </CoinWrap>
                  <Slash>/</Slash>
                  <CoinWrap>
                    <TokenSelectorField
                      tokens={tokens}
                      label="Select Quote Token"
                      name="quoteToken"
                    />
                  </CoinWrap>
                </CoinSelectors>
                {form.errors.baseToken && (
                  <ErrorText color="error">{form.errors.baseToken}</ErrorText>
                )}
                {/* <CheckboxWrap>
                  <CheckboxField
                    label="Use Stable Curve for this pool. ATTENTION, ADVANCED USERS ONLY."
                    name="stableCurve"
                    color="primaryWhite"
                  />

                  <DarkTooltip title={STABLE_POOLS_TOOLTIP}>
                    <InlineText cursor="help" color="success" size="sm">
                      What is stable curve?
                    </InlineText>
                  </DarkTooltip>
                </CheckboxWrap> */}

                <GroupLabel label="Do you want to lock your initial liquidity for a set period of time?" />
                <CheckboxWrap>
                  <RadioGroupContainer>
                    <RadioGroupField
                      options={YES_NO}
                      name="lockInitialLiquidity"
                    />
                  </RadioGroupContainer>
                  <div>
                    <InputField
                      placeholder="0"
                      borderRadius="lg"
                      variant="outline"
                      name="initialLiquidityLockPeriod"
                      append={
                        <InputAppendContainer>
                          <InlineText color="primaryWhite" weight={600}>
                            Days
                          </InlineText>
                        </InputAppendContainer>
                      }
                      formatter={INPUT_FORMATTERS.NATURAL}
                      disabled={!form.values.lockInitialLiquidity}
                    />
                    {form.errors.initialLiquidityLockPeriod &&
                      form.touched.initialLiquidityLockPeriod && (
                        <ErrorText color="error">
                          {form.errors.initialLiquidityLockPeriod}
                        </ErrorText>
                      )}
                  </div>
                </CheckboxWrap>

                <VestingExplanation>
                  <SvgIcon src={AttentionIcon} width="11px" height="47px" />
                  <InlineText size="sm">
                    Pools with locked liquidity will be marked with an
                    additional&nbsp;
                    <SvgIcon
                      src={CrownIcon}
                      width="15px"
                      style={{ paddingTop: '1px' }}
                      height="15px"
                    />
                    &nbsp; in the list, which will increase people&apos;s
                    confidence in the pool, and consequently its popularity.
                  </InlineText>
                </VestingExplanation>
              </>
            )}
            {step === 2 && (
              <>
                <GroupLabel label="Set Base Token initial price" />
                <FlexBlock>
                  <FlexBlock alignItems="center">
                    <InlineText color="success" weight={600}>
                      1&nbsp;
                    </InlineText>
                    <TokenIconWithName mint={form.values.baseToken.mint} />{' '}
                    &nbsp;=
                  </FlexBlock>
                  <NumberInputContainer>
                    <TokenAmountInputField
                      disabled={values.stableCurve}
                      name="price"
                      mint={form.values.quoteToken.mint}
                      value={formatNumberWithSpaces(form.values.price)}
                      onChange={(v) => {
                        setPriceTouched(true)

                        if (v) {
                          const newPrice = parseFloat(formatNumbersForState(v))
                          const {
                            firstDeposit: { baseTokenAmount: bta = '0' },
                          } = values

                          const baseAmount = parseFloat(bta)

                          if (baseAmount) {
                            form.setFieldValue(
                              'firstDeposit.quoteTokenAmount',
                              baseAmount * newPrice
                            )
                            form.setTouched({
                              firstDeposit: {
                                quoteTokenAmount: true,
                              },
                            })
                            setTimeout(() => form.validateForm())
                          }
                        }
                      }}
                    />
                  </NumberInputContainer>
                </FlexBlock>
                <br />
                <GroupLabel label="Add Initial Liquidity" />
                <Centered>
                  <TokenAmountInputField
                    name="firstDeposit.baseTokenAmount"
                    value={formatNumberWithSpaces(
                      form.values.firstDeposit.baseTokenAmount
                    )}
                    setFieldValue={(field: string, value: string) => {
                      form.setFieldValue(field, value)
                      onBaseAmountChange(value)
                    }}
                    available={selectedBaseAccount.amount}
                    mint={form.values.baseToken.mint}
                    onChange={onBaseAmountChange}
                  />
                </Centered>
                {form.errors.firstDeposit?.baseTokenAmount &&
                  form.touched.firstDeposit?.baseTokenAmount && (
                    <ErrorText color="error">
                      {form.errors.firstDeposit.baseTokenAmount}
                    </ErrorText>
                  )}
                <Centered>+</Centered>
                <Centered>
                  <TokenAmountInputField
                    name="firstDeposit.quoteTokenAmount"
                    value={formatNumberWithSpaces(
                      form.values.firstDeposit.quoteTokenAmount
                    )}
                    setFieldValue={(field: string, value: string) => {
                      form.setFieldValue(field, value)
                      onQuoteAmountChange(value)
                    }}
                    available={selectedQuoteAccount.amount}
                    mint={form.values.quoteToken.mint}
                    onChange={onQuoteAmountChange}
                  />
                </Centered>
                {form.errors.firstDeposit?.quoteTokenAmount &&
                  form.touched.firstDeposit?.quoteTokenAmount && (
                    <ErrorText color="error">
                      {form.errors.firstDeposit.quoteTokenAmount}
                    </ErrorText>
                  )}
              </>
            )}
            {step === 3 && (
              <FarmingForm
                farmingRewardFormatted={`${farmingRewardFormatted}`}
                tokens={tokens}
                userTokens={userTokens}
              />
            )}
            {step === 4 && (
              <PoolConfirmationData
                values={values}
                price={priceFormatted}
                farmingRewardPerDay={farmingRewardFormatted}
              />
            )}

            <Footer>
              <ButtonContainer>
                {step === 1 ? (
                  <Button
                    $padding="lg"
                    type="button"
                    onClick={onClose}
                    $variant="outline-white"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    $padding="lg"
                    $variant="outline-white"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                )}
              </ButtonContainer>

              {step === 3 && (
                <ButtonContainer>
                  <Button
                    type="button"
                    $padding="lg"
                    $variant="outline-white"
                    onClick={(e) => {
                      nextStep(e, false)
                    }}
                  >
                    Skip
                  </Button>
                </ButtonContainer>
              )}
              <ButtonContainer>
                {isLastStep ? (
                  <Button type="submit">Create Pool</Button>
                ) : (
                  <ConnectWalletWrapper size="button-only">
                    <Button
                      $padding="lg"
                      type="button"
                      disabled={!form.isValid}
                      onClick={nextStep}
                    >
                      Next
                    </Button>
                  </ConnectWalletWrapper>
                )}
              </ButtonContainer>
            </Footer>
          </form>
        </FormikProvider>
        {processing && (
          <PoolProcessingModal
            status={processingStatus}
            step={processingStep}
            onSuccess={() => {
              setProcessing(false)
              onClose()
            }}
            onError={() => {
              setProcessing(false)
            }}
          />
        )}
      </Body>
    </>
  )
}
