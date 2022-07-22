import { PublicKey } from '@solana/web3.js'
import { ApolloQueryResult } from 'apollo-client'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useMemo, useState } from 'react'
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
import { CURVE } from '@sb/dexUtils/pools/types'
import { sendSignedSignleTransaction } from '@sb/dexUtils/transactions'
import { SendSignedTransactionResult } from '@sb/dexUtils/types'
import {
  sleep,
  formatNumbersForState,
  formatNumberWithSpaces,
} from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  SendTransactionStatus,
  buildCreatePoolTransactions,
  SendTransactionDetails,
} from '@core/solana'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'

import CrownIcon from '@icons/crownIcon.svg'

import { PoolInfo } from '../../../index.types'
import { FarmingForm, YES_NO } from './FarmingForm'
import { PoolConfirmationData } from './PoolConfirmationData'
import {
  PoolProcessingModal,
  TransactionStatus,
  POOL_ERRORS,
} from './PoolProcessingModal'
import {
  AttentionIcon,
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
  retries = 15
): Promise<PoolInfo | null> => {
  if (retries === 0) {
    return null
  }
  const poolStr = pool.toBase58()

  let retriesMade = 0
  while (retriesMade < retries) {
    const data = await refetch()

    const {
      data: { getPoolsInfo },
    } = data
    const createdPool = getPoolsInfo.find((p) => p.swapToken === poolStr)
    if (createdPool) {
      return createdPool
    }
    await sleep(20_000)
    retriesMade += 1
  }
  return null
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
  const [error, setError] = useState<undefined | POOL_ERRORS>()
  const [failedTxId, setFailedTxId] = useState<undefined | string>()
  const [processingStep, setProcessingStep] = useState(0)
  const [priceTouched, setPriceTouched] = useState(false)
  const stepsSize = steps.length

  const { wallet } = useWallet()
  const connection = useConnection()
  const history = useHistory()

  const tokens: Token[] = useMemo(
    () =>
      userTokens
        .map((ut) => ({
          mint: ut.mint,
          account: ut.address,
          balance: ut.amount,
        }))
        .sort((a, b) => a.mint.localeCompare(b.mint)),
    [userTokens]
  )

  const setTransactionError = (
    err: POOL_ERRORS,
    txStatus: SendSignedTransactionResult,
    txId?: string
  ) => {
    setError(err)
    setProcessingStatus('error')
    if (txStatus !== 'timeout') {
      setFailedTxId(txId)
    }
  }

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
      setError(undefined)
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
          await buildCreatePoolTransactions({
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
        if (createAccountsTxId.status !== SendTransactionStatus.CONFIRMED) {
          setTransactionError(
            createAccountsTxId.details?.includes(SendTransactionDetails.TIMEOUT)
              ? POOL_ERRORS.ACCOUNTS_CREATION_TIMEOUT
              : POOL_ERRORS.ACCOUNTS_CREATION_FAILED,
            createAccountsTxId.status,
            createAccountsTxId.transactionId
          )
          return
        }

        setProcessingStep(2)
        console.log('Set authorities...')
        const setAuthoritiesTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.setAuthorities,
          connection,
        })
        if (setAuthoritiesTxId.status !== SendTransactionStatus.CONFIRMED) {
          setTransactionError(
            setAuthoritiesTxId.details?.includes(SendTransactionDetails.TIMEOUT)
              ? POOL_ERRORS.SETTING_AUTHORITIES_TIMEOUT
              : POOL_ERRORS.SETTING_AUTHORITIES_TIMEOUT,
            setAuthoritiesTxId.status,
            setAuthoritiesTxId.transactionId
          )
          return
        }
        console.log('setAuthoritiesTxId: ', setAuthoritiesTxId.status)

        console.log('Initialize pool...')
        setProcessingStep(3)
        const initPoolTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.createPool,
          connection,
        })
        if (initPoolTxId.status !== SendTransactionStatus.CONFIRMED) {
          setTransactionError(
            initPoolTxId.details?.includes(SendTransactionDetails.TIMEOUT)
              ? POOL_ERRORS.POOL_CREATION_TIMEOUT
              : POOL_ERRORS.POOL_CREATION_FAILED,
            initPoolTxId.status,
            initPoolTxId.transactionId
          )
          return
        }
        console.log('initPoolTxId: ', initPoolTxId.status)

        console.log('First deposit...')
        setProcessingStep(4)
        const firstDepositTxId = await sendSignedSignleTransaction({
          transaction: generatedTransactions.firstDeposit,
          connection,
        })
        if (firstDepositTxId.status !== SendTransactionStatus.CONFIRMED) {
          setTransactionError(
            firstDepositTxId.details?.includes(SendTransactionDetails.TIMEOUT)
              ? POOL_ERRORS.DEPOSIT_TIMEOUT
              : POOL_ERRORS.DEPOSIT_FAILED,
            firstDepositTxId.status,
            firstDepositTxId.transactionId
          )
          return
        }

        console.log('firstDepositTxId: ', firstDepositTxId.status)

        if (generatedTransactions.farming) {
          console.log('Initialize farming...')
          setProcessingStep(5)
          const farmingTxId = await sendSignedSignleTransaction({
            transaction: generatedTransactions.farming,
            connection,
          })
          if (farmingTxId.status !== SendTransactionStatus.CONFIRMED) {
            setTransactionError(
              farmingTxId.details?.includes(SendTransactionDetails.TIMEOUT)
                ? POOL_ERRORS.FARMING_CREATION_TIMEOUT
                : POOL_ERRORS.FARMING_CREATION_FAILED,
              farmingTxId.status,
              farmingTxId.transactionId
            )
            return
          }
          await sleep(1000)
          console.log('farmingTxId: ', farmingTxId.status)
        }

        setProcessingStep(6)

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

      const farmingRewardAccount = userTokens.find(
        (ut) => ut.address === values.farming.token.account
      )

      const tokensMultiplier = 10 ** (farmingRewardAccount?.decimals || 0)

      const tokensPerPeriod =
        (parseFloat(values.farming.tokenAmount) * HOUR) /
        DAY /
        parseFloat(values.farming.farmingPeriod)

      const tokensPerPeriodWithMultiplier = new BN(
        (tokensPerPeriod * tokensMultiplier).toFixed(0)
      )

      if (!tokensPerPeriodWithMultiplier.toNumber()) {
        return {
          farming: {
            tokenAmount: 'Farming rewards for period is less than minimum',
          },
        }
      }

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
                      data-testid="create-pool-base-token-field"
                      tokens={tokens}
                      label="Select Base Token"
                      name="baseToken"
                    />
                  </CoinWrap>
                  <Slash>/</Slash>
                  <CoinWrap>
                    <TokenSelectorField
                      data-testid="create-pool-quote-token-field"
                      tokens={tokens}
                      label="Select Quote Token"
                      name="quoteToken"
                    />
                  </CoinWrap>
                </CoinSelectors>
                {form.errors.baseToken && (
                  <ErrorText color="red3">{form.errors.baseToken}</ErrorText>
                )}
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
                      data-testid="create-pool-lock-period-field"
                      placeholder="0"
                      borderRadius="lg"
                      variant="outline"
                      name="initialLiquidityLockPeriod"
                      append={
                        <InputAppendContainer>
                          <InlineText color="white1" weight={600}>
                            Days
                          </InlineText>
                        </InputAppendContainer>
                      }
                      formatter={INPUT_FORMATTERS.NATURAL}
                      disabled={!form.values.lockInitialLiquidity}
                    />
                    {form.errors.initialLiquidityLockPeriod &&
                      form.touched.initialLiquidityLockPeriod && (
                        <ErrorText color="red3">
                          {form.errors.initialLiquidityLockPeriod}
                        </ErrorText>
                      )}
                  </div>
                </CheckboxWrap>

                <VestingExplanation>
                  <AttentionIcon>
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 11 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.72 31.792H2.04V0.688H9.72V31.792ZM0.76 41.52C0.76 40.1547 1.25067 38.9813 2.232 38C3.256 37.0187 4.472 36.528 5.88 36.528C7.24533 36.528 8.44 36.9973 9.464 37.936C10.488 38.8747 11 40.0267 11 41.392C11 42.7573 10.488 43.9307 9.464 44.912C8.48267 45.8933 7.288 46.384 5.88 46.384C5.19733 46.384 4.536 46.256 3.896 46C3.29867 45.744 2.76533 45.4027 2.296 44.976C1.82667 44.5493 1.44267 44.0373 1.144 43.44C0.888 42.8427 0.76 42.2027 0.76 41.52Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </AttentionIcon>
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
                    <InlineText weight={600} color="white1">
                      1&nbsp;
                    </InlineText>
                    <TokenIconWithName mint={form.values.baseToken.mint} />{' '}
                    <InlineText weight={600} color="white1">
                      &nbsp;=
                    </InlineText>
                  </FlexBlock>
                  <NumberInputContainer>
                    <TokenAmountInputField
                      data-testid="create-pool-price-field"
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
                    data-testid="create-pool-base-token-amount-field"
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
                    <ErrorText color="red3">
                      {form.errors.firstDeposit.baseTokenAmount}
                    </ErrorText>
                  )}
                <Centered>
                  <InlineText weight={600} color="white1">
                    +
                  </InlineText>
                </Centered>
                <Centered>
                  <TokenAmountInputField
                    data-testid="create-pool-quote-token-amount-field"
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
                    <ErrorText color="red3">
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
                  <Button
                    data-testid="create-pool-submit-btn"
                    $padding="lg"
                    type="submit"
                  >
                    Create Pool
                  </Button>
                ) : (
                  <ConnectWalletWrapper size="button-only">
                    <Button
                      data-testid="create-pool-next-step-btn"
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
            error={error}
            status={processingStatus}
            step={processingStep}
            txId={failedTxId}
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
