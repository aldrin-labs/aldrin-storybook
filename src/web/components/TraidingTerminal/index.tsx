import React, { PureComponent, SyntheticEvent } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import SmallSlider from '@sb/components/Slider/SmallSlider'

import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import Yup from 'yup'

import { toNumber, toPairs } from 'lodash-es'

import { Grid, InputAdornment, Typography } from '@material-ui/core'

import { traidingErrorMessages } from '@core/config/errorMessages'

import { PlaseOrderDialog } from '../PlaseOrderDialog'

import { IProps, FormValues, IPropsWithFormik, priceType } from './types'

import {
  getBaseQuantityFromQuote,
  getQuoteQuantityFromBase,
} from '@core/utils/chartPageUtils'

import {
  Container,
  GridContainer,
  Coin,
  PaddingGrid,
  InputTitle,
  InputWrapper,
  TradeInputBlock,
  TradeInput,
  TotalGrid,
  PriceContainer,
} from './styles'
import { SendButton } from '../TraidingTerminal/styles'

import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'

const TradeInputContainer = ({
  title,
  value = '',
  step,
  onChange,
  coin,
  style,
  type,
  pattern,
}) => {
  return (
    <TradeInputBlock style={style}>
      <InputTitle>{title}:</InputTitle>
      <InputWrapper>
        <TradeInput
          isValid={true}
          value={value}
          onChange={onChange}
          type={type || 'number'}
          pattern={pattern}
          step={step}
          min={0}
        />
        <Coin>{coin}</Coin>
      </InputWrapper>
    </TradeInputBlock>
  )
}

const FormError = ({ children }: any) => (
  <Typography color="error" style={{ textAlign: 'right' }}>
    {children}
  </Typography>
)

// function is removing all decimals after set number without rounding
const toFixedTrunc = (value, n) => {
  const v = value.toString().split('.')
  if (n <= 0) return v[0]
  let f = v[1] || ''
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`
  while (f.length < n) f += '0'
  return `${v[0]}.${f}`
}

@withTheme
class TraidingTerminal extends PureComponent<IPropsWithFormik> {
  componentDidUpdate(prevProps) {
    if (prevProps.priceType !== this.props.priceType) {
      const {
        priceType,
        values: { amount, price, limit },
      } = this.props

      const priceForCalculate =
        priceType !== 'market' && limit !== null ? limit : price

      this.setFormatted('total', amount * priceForCalculate, 1)
    }

    if (prevProps.priceFromOrderbook !== this.props.priceFromOrderbook) {
      const {
        priceFromOrderbook,
        values: { amount },
      } = this.props
      this.setFormatted('limit', priceFromOrderbook, 1)
      this.setFormatted('total', amount * priceFromOrderbook, 1)
    }
  }

  setFormatted = (fild: priceType, value: any, index: number) => {
    const { decimals = [8, 8], setFieldValue } = this.props
    const numberValue = toNumber(value)

    if (value === '') setFieldValue(fild, '', false)
    else if (numberValue.toString().includes('e')) {
      setFieldValue(fild, numberValue.toFixed(8), false)
    } else if (
      value.toString().split('.')[1] &&
      value.toString().split('.')[1].length > decimals[index]
    ) {
      setFieldValue(
        fild,
        toFixedTrunc(numberValue, decimals[index]) || 0,
        false
      )
    } else setFieldValue(fild, numberValue, false)
  }

  onStopChange = (e: SyntheticEvent<Element>) => {
    const { setFieldTouched } = this.props
    this.setFormatted('stop', e.target.value, 1)
    setFieldTouched('stop', true)
  }

  onTotalChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      byType,
      values: { limit, price, total },
      setFieldTouched,
      errors,
      funds,
      decimals,
    } = this.props
    // if (
    //   (errors.amount === traidingErrorMessages[1] ||
    //     errors.total === traidingErrorMessages[1]) &&
    //   e.target.value > total
    // )
    //   return null

    const priceForCalculate =
      priceType !== 'market' && limit !== null ? limit : price

    this.setFormatted('total', e.target.value, 1)
    setFieldTouched('total', true)

    if (priceForCalculate) {
      const amount =
        toFixedTrunc(e.target.value, decimals[1]) / priceForCalculate
      const maxAmount = byType === 'buy' ? funds[1].quantity : funds[0].quantity
      const percentageAmount = Math.floor(
        (amount * priceForCalculate) / ((maxAmount * priceForCalculate) / 100)
      )

      // todo: fix this, in amount i have btc amount
      console.log('pre', amount, priceForCalculate, maxAmount)

      this.props.changePercentage(percentageAmount)
      this.setFormatted('amount', amount, 0)
      setFieldTouched('amount', true)
    }
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      isSPOTMarket,
      leverage,
      setFieldValue,
      values: { amount, price, limit },
      setFieldTouched,
      errors,
      funds,
    } = this.props

    const priceForCalculate =
      priceType !== 'market' && limit !== null ? limit : price

    // if (
    //   (errors.amount === traidingErrorMessages[1] ||
    //     errors.total === traidingErrorMessages[1]) &&
    //   e.target.value > amount
    // )
    //   return null

    // if (
    //   +e.target.value > (funds[1].quantity * leverage) / priceForCalculate &&
    //   !isSPOTMarket
    // ) {
    //   setFieldValue(
    //     'amount',
    //     ((funds[1].quantity * leverage) / priceForCalculate).toFixed(3)
    //   )
    //   return null
    // }

    const total = e.target.value * priceForCalculate

    const newAmount = isSPOTMarket
      ? e.target.value
      : +e.target.value > 0
      ? +e.target.value * leverage
      : e.target.value

    setFieldValue('amount', e.target.value)
    setFieldTouched('amount', true)

    this.setFormatted('total', total, 1)
    setFieldTouched('total', true)
  }

  onPriceChange = (e: SyntheticEvent<Element>) => {
    const { values, setFieldTouched } = this.props
    this.setFormatted('price', e.target.value, 1)
    const total = e.target.value * values.amount
    this.setFormatted('total', total, 1)

    setFieldTouched('price', true)
    setFieldTouched('total', true)
  }

  onLimitChange = (e: SyntheticEvent<Element>) => {
    const { values, setFieldTouched } = this.props
    const total = e.target.value * values.amount

    this.setFormatted('limit', e.target.value, 1)
    this.setFormatted('total', total, 1)

    setFieldTouched('limit', true)
    setFieldTouched('total', true)
  }

  onPercentageClick = (value: number) => {
    const {
      values: { limit, price },
      funds,
      setFieldValue,
      setFieldTouched,
      validateForm,
      priceType,
      byType,
      isSPOTMarket,
      leverage,
    } = this.props

    const priceForCalculate =
      priceType !== 'market' && limit !== null ? limit : price

    if (byType === 'buy') {
      const baseQuantity = getBaseQuantityFromQuote({
        quoteQuantity: funds[1].quantity,
        price: priceForCalculate,
        percentage: value,
      })

      this.setFormatted('total', funds[1].quantity * value, 1)
      setFieldValue(
        'amount',
        isSPOTMarket
          ? baseQuantity.toFixed(8)
          : (baseQuantity * leverage).toFixed(3)
      )
    } else {
      const necessaryFund = isSPOTMarket ? funds[0] : funds[1]

      const quoteQuantity = getQuoteQuantityFromBase({
        baseQuantity: necessaryFund.quantity,
        price: priceForCalculate,
        percentage: value,
      })

      const amount = isSPOTMarket
        ? necessaryFund.quantity * value
        : (necessaryFund.quantity / price) * value

      this.setFormatted('total', quoteQuantity, 1)
      setFieldValue(
        'amount',
        isSPOTMarket ? amount.toFixed(8) : (amount * leverage).toFixed(3)
      )
    }

    setFieldTouched('amount', true)
    setFieldTouched('total', true)
    validateForm()
  }

  render() {
    const {
      pair,
      funds,
      leverage,
      percentage,
      changePercentage,
      operationType,
      priceType,
      isSPOTMarket,
      values,
      handleSubmit,
      validateForm,
      setFieldValue,
    } = this.props

    if (!funds) return null

    const isBuyType = operationType === 'buy'

    const priceForCalculate =
      priceType !== 'market' && values.limit !== null
        ? values.limit
        : values.price

    let maxAmount = 0

    if (isSPOTMarket) {
      maxAmount =
      isBuyType ? funds[1].quantity : funds[0].quantity
    } else {
      maxAmount = funds[1].quantity * leverage
    }

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={pair}>
          <Grid item container xs={9} style={{ maxWidth: '100%' }}>
            <div style={{ margin: 'auto 0', width: '100%' }}>
              {priceType !== 'market' ? (
                <InputRowContainer key={'limit-price'}>
                  <TradeInputContainer
                    title={'Price'}
                    value={values.limit || ''}
                    onChange={this.onLimitChange}
                    coin={pair[1]}
                  />
                </InputRowContainer>
              ) : null}

              {priceType === 'stop-limit' ? (
                <InputRowContainer key={'stop-limit'}>
                  <TradeInputContainer
                    title={'Stop'}
                    coin={pair[1]}
                    value={values.stop || ''}
                    onChange={this.onStopChange}
                  />
                </InputRowContainer>
              ) : null}

              <InputRowContainer
                direction="column"
                justify={priceType === 'market' ? 'flex-end' : 'center'}
              >
                <TradeInputContainer
                  title={isSPOTMarket ? `Amount` : 'qtty'}
                  type={'text'}
                  pattern={isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'}
                  value={values.amount}
                  onChange={this.onAmountChange}
                  coin={pair[0]}
                  step={!isSPOTMarket && 0.001}
                  style={{ paddingBottom: '.8rem' }}
                />

                <BlueSlider
                  value={
                    isBuyType || !isSPOTMarket
                      ? values.total / (maxAmount / 100)
                      : values.amount / (maxAmount / 100)
                  }
                  sliderContainerStyles={{
                    width: '70%',
                    margin: '0 0 0 auto',
                  }}
                  onChange={(value) => {
                    const newValue = (maxAmount / 100) * value

                    const newAmount =
                      isBuyType || !isSPOTMarket
                        ? newValue / priceForCalculate
                        : newValue

                    const newTotal =
                      isBuyType || !isSPOTMarket
                        ? newValue
                        : newValue * priceForCalculate

                    const fixedAmount =
                      isSPOTMarket
                        ? newAmount.toFixed(8)
                        : newAmount.toFixed(3)

                    setFieldValue('amount', fixedAmount)
                    setFieldValue('total', newTotal.toFixed(8))
                  }}
                />
              </InputRowContainer>

              {isSPOTMarket && (
                <InputRowContainer direction="column" justify="center">
                  <TradeInputContainer
                    title={`Total`}
                    value={values.total || ''}
                    onChange={this.onTotalChange}
                    coin={pair[1]}
                  />
                </InputRowContainer>
              )}

              {/* {pairsErrors.length > 0 && (
                  <FormError>
                    {pairsErrors.length ? pairsErrors[0][1] : '\u00A0'}
                  </FormError>
                )} */}

              {!isSPOTMarket && (
                <InputRowContainer justify="flex-end">
                  <Grid xs={1} item />
                  <Grid
                    xs={11}
                    item
                    container
                    direction="column"
                    justify={priceType === 'stop-limit' ? 'flex-end' : 'center'}
                  >
                    <Grid
                      container
                      justify="space-between"
                      style={{ padding: '.6rem 0' }}
                    >
                      <InputTitle>cost:</InputTitle>
                      <InputTitle color="#16253D" style={{ width: 'auto' }}>
                        {values.amount > 0
                          ? (funds[1].quantity / 100 * (isBuyType || !isSPOTMarket
                            ? values.total / (maxAmount / 100)
                            : values.amount / (maxAmount / 100) / 100)).toFixed(2)
                          : 0.0}{' '}
                        {pair[1]}
                      </InputTitle>
                    </Grid>

                    <Grid
                      container
                      justify="space-between"
                      style={{ padding: '.6rem 0' }}
                    >
                      <InputTitle>max buy:</InputTitle>
                      <InputTitle color="#16253D" style={{ width: 'auto' }}>
                        {(
                          (funds[1].quantity * leverage) /
                          priceForCalculate
                        ).toFixed(3)}{' '}
                        {pair[0]}
                      </InputTitle>
                    </Grid>
                  </Grid>
                </InputRowContainer>
              )}
            </div>
          </Grid>

          <Grid xs={3} item container style={{ maxWidth: '100%' }}>
            <Grid xs={1} item />
            <Grid xs={11} item container alignItems="center">
              <SendButton
                type={operationType}
                onClick={async () => {
                  const result = await validateForm()

                  if (Object.keys(result).length === 0) {
                    await handleSubmit(values)
                  }
                }}
              >
                {isSPOTMarket
                  ? operationType === 'buy'
                    ? `buy ${pair[0]}`
                    : `sell ${pair[0]}`
                  : operationType === 'buy'
                  ? 'buy/long'
                  : 'sell/short'}
              </SendButton>
            </Grid>
          </Grid>
        </GridContainer>
      </Container>
    )
  }
}

const validate = (values: FormValues, props: IProps) => {
  const { priceType, byType, funds, isSPOTMarket } = props

  const validationSchema =
    priceType === 'limit'
      ? Yup.object().shape({
          price: Yup.number()
            .nullable(true)
            .required(traidingErrorMessages[0])
            .moreThan(0, traidingErrorMessages[0]),
          amount:
            byType === 'sell'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(
                    isSPOTMarket ? funds[0].quantity : funds[1].quantity,
                    traidingErrorMessages[1]
                  )
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
          total:
            byType === 'buy'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(funds[1].quantity, traidingErrorMessages[1])
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
        })
      : priceType === 'market'
      ? Yup.object().shape({
          amount:
            byType === 'sell'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(
                    isSPOTMarket ? funds[0].quantity : funds[1].quantity,
                    traidingErrorMessages[1]
                  )
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
          total:
            byType === 'buy'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(funds[1].quantity, traidingErrorMessages[1])
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
        })
      : Yup.object().shape({
          stop: Yup.number()
            .nullable(true)
            .required(traidingErrorMessages[0])
            .moreThan(0, traidingErrorMessages[0]),
          limit: Yup.number()
            .nullable(true)
            .required(traidingErrorMessages[0])
            .moreThan(0, traidingErrorMessages[0]),
          amount:
            byType === 'sell'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(
                    isSPOTMarket ? funds[0].quantity : funds[1].quantity,
                    traidingErrorMessages[1]
                  )
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
          total:
            byType === 'buy'
              ? Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0])
                  .max(funds[1].quantity, traidingErrorMessages[1])
              : Yup.number()
                  .nullable(true)
                  .required(traidingErrorMessages[0])
                  .moreThan(0, traidingErrorMessages[0]),
        })

  try {
    validateYupSchema(values, validationSchema, true)
  } catch (err) {
    return yupToFormErrors(err)
  }

  return {}
}

const formikEnhancer = withFormik<IProps, FormValues>({
  validate: validate,
  mapPropsToValues: (props) => ({
    price: props.marketPrice,
    stop: null,
    limit: props.marketPrice,
    amount: null,
    total: null,
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const {
      byType,
      priceType,
      isSPOTMarket,
      leverage,
      reduceOnly,
      orderMode,
      TIFMode,
      trigger,
    } = props

    if (priceType || byType) {
      const filtredValues =
        priceType === 'limit'
          ? { limit: values.limit, price: values.price, amount: values.amount }
          : priceType === 'market'
          ? { amount: values.amount }
          : {
              stop: values.stop,
              limit: values.limit,
              amount: values.amount,
            }

      const priceForCalculate =
        priceType !== 'market' && values.limit !== null
          ? values.limit
          : values.price

      if (values.amount * priceForCalculate < 10) {
        props.showOrderResult({ status: 'error', message: 'Total value must be at least 10.' })
        return
      }

      const result = await props.confirmOperation(
        byType,
        priceType,
        filtredValues,
        'default',
        {},
        {
          // leverage,
          marketType: isSPOTMarket ? 0 : 1,
          ...(priceType !== 'market'
            ? orderMode === 'TIF'
              ? { timeInForce: TIFMode, postOnly: false }
              : { postOnly: true }
            : {}),
          ...(priceType === 'stop-limit'
            ? {
                workingType:
                  trigger === 'mark price' ? 'MARK_PRICE' : 'CONTRACT_PRICE',
              }
            : {}),
          // ...(priceType !== 'stop-limit' ? { reduceOnly } : {}),
        }
      )

      props.showOrderResult(result, props.cancelOrder)
      setSubmitting(false)
    }
  },
})

export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
