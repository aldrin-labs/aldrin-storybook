import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY, HOUR } from '@core/utils/dateUtils'
import { Button } from '@sb/components/Button'
import {
  GroupLabel,
  RadioGroupField,
} from '@sb/components/FormElements'
import { InputField, INPUT_FORMATTERS } from '@sb/components/Input'
import { FlexBlock } from '@sb/components/Layout'
import { ModalTitleBlock } from '@sb/components/Modal'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { TokenSelectorField } from '@sb/components/TokenSelector'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { InlineText } from '@sb/components/Typography'
import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { SvgIcon } from '@sb/components'
import CrownIcon from '@icons/crownIcon.svg'
import AttentionIcon from '@icons/attentionWhite.svg'
import {
  createPoolTransactions,
  CURVE,
} from '@sb/dexUtils/pools/actions/createPool'
import { sendAndWaitSignedTransaction } from '@sb/dexUtils/send'
import { TokenInfo } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import { ApolloQueryResult } from 'apollo-client'
import BN from 'bn.js'
import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { sleep } from '@sb/dexUtils/utils'
import { useHistory } from 'react-router'
import { PoolInfo } from '../../../index.types'
import { FarmingForm, YES_NO } from './FarmingForm'
import { PoolConfirmationData } from './PoolConfirmationData'
import { PoolProcessingModal, TransactionStatus } from './PoolProcessingModal'
import {
  Body,
  Centered,
  CheckboxWrap,
  CoinSelectors,
  CoinWrap,
  Error,
  Footer,
  InputAppendContainer,
  NumberInputContainer,
  RadioGroupContainer,
  Slash,
  Title,
  VestingExplanation,
} from './styles'
import { TokenAmountInputField } from './TokenAmountInput'
import { CreatePoolFormType } from './types'
import { notify } from '../../../../../dexUtils/notifications'

interface CreatePoolProps {
  onClose: () => void
  userTokens: TokenInfo[]
  pools: (Pool | PoolV2)[]
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
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

const STABLE_POOLS_TOOLTIP =
  'Stable pools are designed specifically for pegged assets that trade at a similar price. e.g. mSOL/SOL (SOL-pegged), USDC/USDT (USD-pegged) etc.'

const checkPoolCreated = async (
  pool: PublicKey,
  refetch: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
): Promise<PoolInfo> => {
  const poolStr = pool.toBase58()
  const data = await refetch()

  const {
    data: { getPoolsInfo },
  } = data
  const createdPool = getPoolsInfo.find((p) => p.swapToken === poolStr)
  if (!createdPool) {
    await sleep(20_000)
    return checkPoolCreated(pool, refetch)
  }
  return createdPool
}

export const CreatePoolForm: React.FC<CreatePoolProps> = (props) => {
  const { onClose, userTokens, pools, refetchPools } = props
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] =
    useState<TransactionStatus>('processing')
  const [processingStep, setProcessingStep] = useState(0)
  const [priceTouched, setPriceTouched] = useState(false)
  const stepsSize = steps.length

  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()
  const history = useHistory()

  const tokens: Token[] = userTokens
    .map((ut) => ({
      mint: ut.mint,
      account: ut.address,
      balance: ut.amount,
    }))
    .sort((a, b) => a.mint.localeCompare(b.mint))

  const form = useFormik<CreatePoolFormType>({
    validateOnMount: true,
    initialValues: {
      price: '1',
      baseToken: tokens[0],
      quoteToken: tokens[1],
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
        vestingEnabled: true,
        tokenAmount: '',
        farmingPeriod: '14',
        vestingPeriod: '7',
      },
    },
    onSubmit: async (values) => {
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
                parseFloat(values.firstDeposit.baseTokenAmount) *
                  10 ** (selectedBaseAccount?.decimals || 0)
              ),
              userBaseTokenAccount: new PublicKey(
                values.baseToken.account || ''
              ),
              quoteTokenAmount: new BN(
                parseFloat(values.firstDeposit.quoteTokenAmount) *
                  10 ** (selectedQuoteAccount?.decimals || 0)
              ),
              userQuoteTokenAccount: new PublicKey(
                values.quoteToken.account || ''
              ),
              vestingPeriod: values.lockInitialLiquidity
                ? new BN(values.initialLiquidityLockPeriod).muln(DAY)
                : undefined,
            },
            farming: values.farmingEnabled
              ? {
                  farmingTokenMint: new PublicKey(values.farming.token.mint),
                  farmingTokenAccount: new PublicKey(
                    values.farming.token.account || ''
                  ),
                  tokenAmount: new BN(
                    parseFloat(values.farming.tokenAmount) * tokensMultiplier
                  ),
                  periodLength: new BN(HOUR),
                  tokensPerPeriod: new BN(tokensPerPeriod * tokensMultiplier),
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
        const createAccountsTxId = await sendAndWaitSignedTransaction(
          generatedTransactions.createAccounts,
          connection,
          { sleepAfter: 1000 }
        )
        console.log('createAccountsTxId: ', createAccountsTxId)

        setProcessingStep(2)
        console.log('Set authorities...')
        const setAuthoritiesTxId = await sendAndWaitSignedTransaction(
          generatedTransactions.setAuthorities,
          connection,
          { sleepAfter: 1000 }
        )
        console.log('setAuthoritiesTxId: ', setAuthoritiesTxId)

        console.log('Initialize pool...')
        setProcessingStep(3)
        const initPoolTxId = await sendAndWaitSignedTransaction(
          generatedTransactions.createPool,
          connection,
          { sleepAfter: 1000 }
        )
        console.log('initPoolTxId: ', initPoolTxId)

        console.log('First deposit...')
        setProcessingStep(4)
        const firstDepositTxId = await sendAndWaitSignedTransaction(
          generatedTransactions.firstDeposit,
          connection,
          { sleepAfter: 1000 }
        )
        console.log('firstDepositTxId: ', firstDepositTxId)

        if (generatedTransactions.farming) {
          console.log('Initialize farming...')
          setProcessingStep(5)
          const farmingTxId = await sendAndWaitSignedTransaction(
            generatedTransactions.farming,
            connection,
            { sleepAfter: 1000 }
          )
          console.log('firstDepositTxId: ', farmingTxId)
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

        history.push(`/pools/${createdPool.parsedName}`)
        onClose()
      } catch (e) {
        console.error('Unable to create pool: ', e)
        setProcessingStatus('error')
      }
    },
    validate: async (values) => {
      const {
        baseToken: { mint: baseTokenMint },
        quoteToken: { mint: quoteTokenMint },
      } = values

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

      // if (
      //   values.lockInitialLiquidity &&
      //   !(parseFloat(values.initialLiquidityLockPeriod) > 0)
      // ) {
      //   return {
      //     initialLiquidityLockPeriod: 'Please enter a valid lock duration.',
      //   }
      // }

      // if (
      //   values.farming.vestingEnabled &&
      //   !(parseFloat(values.farming.vestingPeriod || '0') > 0)
      // ) {
      //   return {
      //     farming: { vestingPeriod: 'Please enter a valid vesting period.' },
      //   }
      // }

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
    (ut) => ut.address === values.baseToken.account
  )
  const selectedQuoteAccount = userTokens.find(
    (ut) => ut.address === values.quoteToken.account
  )
  const farmingRewardAccount = userTokens.find(
    (ut) => ut.address === values.farming.token.account
  )

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
    if (values.stableCurve) {
      form.setFieldValue('firstDeposit.quoteTokenAmount', value)
    } else if (priceTouched) {
      const userDefinedPrice = parseFloat(values.price || '1')
      const newPrice = parseFloat(value) * userDefinedPrice
      if (newPrice) {
        form.setFieldValue('firstDeposit.quoteTokenAmount', newPrice)
      }
    } else {
      const newPrice =
        parseFloat(value) / parseFloat(values.firstDeposit.quoteTokenAmount)
      if (newPrice) {
        form.setFieldValue('price', stripByAmount(newPrice))
      }
    }

    setTimeout(() => form.validateForm())
  }

  const onQuoteAmountChange = (value: string) => {
    if (values.stableCurve) {
      form.setFieldValue('firstDeposit.baseTokenAmount', value)
    } else if (priceTouched) {
      const userDefinedPrice = parseFloat(values.price || '1')
      const newPrice = parseFloat(value) / userDefinedPrice
      if (newPrice) {
        form.setFieldValue('firstDeposit.baseTokenAmount', newPrice)
      }
    } else {
      const newPrice =
        parseFloat(values.firstDeposit.baseTokenAmount) / parseFloat(value)
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
                  <Error color="error">{form.errors.baseToken}</Error>
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

                <GroupLabel label="Do you want to lock your initial liquidity for some time?" />
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
                        <Error color="error">
                          {form.errors.initialLiquidityLockPeriod}
                        </Error>
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
                      available={selectedBaseAccount.amount}
                      mint={form.values.quoteToken.mint}
                      onChange={(v) => {
                        setPriceTouched(true)
                        if (v) {
                          const newPrice = parseFloat(v)
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
                    <Error color="error">
                      {form.errors.firstDeposit.baseTokenAmount}
                    </Error>
                  )}
                <Centered>+</Centered>
                <Centered>
                  <TokenAmountInputField
                    name="firstDeposit.quoteTokenAmount"
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
                    <Error color="error">
                      {form.errors.firstDeposit.quoteTokenAmount}
                    </Error>
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

              {step === 3 && (
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
              )}
              {isLastStep ? (
                <Button type="submit">Create Pool</Button>
              ) : (
                <Button
                  $padding="lg"
                  type="button"
                  disabled={!form.isValid}
                  onClick={nextStep}
                >
                  Next
                </Button>
              )}
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
