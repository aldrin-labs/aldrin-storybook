import React, { PureComponent, SyntheticEvent } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import Yup from 'yup'

import { toNumber, toPairs } from 'lodash-es'

import { Grid, InputAdornment, Typography } from '@material-ui/core'

import { traidingErrorMessages } from '@core/config/errorMessages'

import { PlaseOrderDialog } from '../PlaseOrderDialog'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import { CSS_CONFIG } from '@sb/config/cssConfig'

import { IProps, FormValues, IPropsWithFormik, priceType } from './types'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import {
  getBaseQuantityFromQuote,
  getQuoteQuantityFromBase,
} from '@core/utils/chartPageUtils'

import {
  Container,
  NameHeader,
  InputContainer,
  TitleContainer,
  PriceButton,
  GridContainer,
  ButtonContainer,
  ByButtonContainer,
  InputTextField,
  //,
  Coin,
  PaddingGrid,
  InputTitle,
  InputWrapper,
  BalanceItem,
  BalanceTitle,
  TradingItemTitle,
  TradingItemValue,
  TradingItemSubValue,
  TradeBlock,
  TradeInput,
  PercentageGrid,
  PercentageItem,
  SendButton,
  PriceContainer,
} from './styles'

const TradeInputContainer = ({ title, value, onChange, coin }) => {
  return (
    <>
      <InputTitle>{title}</InputTitle>
      <InputWrapper>
        <TradeInput value={value} onChange={onChange} type="number" />
        <Coin>{coin}</Coin>
      </InputWrapper>
    </>
  )
}

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
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
  }

  setFormatted = (fild: priceType, value: any, index: number) => {
    const { decimals = [8, 8], setFieldValue } = this.props
    const numberValue = toNumber(value)

    console.log('value', numberValue)
    console.log('formatted', toFixedTrunc(numberValue, decimals[index]))
    console.log(
      'condition',
      value.toString().split('.')[1] &&
        value.toString().split('.')[1].length > decimals[index]
    )

    if (value === '') setFieldValue(fild, '', false)
    else if (numberValue.toString().includes('e')) {
      setFieldValue(fild, numberValue.toFixed(8), false)
    } else if (
      value.toString().split('.')[1] &&
      value.toString().split('.')[1].length > decimals[index]
    ) {
      setFieldValue(fild, toFixedTrunc(numberValue, decimals[index]), false)
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
      values: { limit, price, total },
      setFieldTouched,
      errors,
      decimals,
    } = this.props
    if (
      (errors.amount === traidingErrorMessages[1] ||
        errors.total === traidingErrorMessages[1]) &&
      e.target.value > total
    )
      return null

    const priceForCalculate =
      priceType !== 'market' && limit !== null ? limit : price

    this.setFormatted('total', e.target.value, 1)
    setFieldTouched('total', true)

    if (priceForCalculate) {
      const amount =
        toFixedTrunc(e.target.value, decimals[1]) / priceForCalculate

      this.setFormatted('amount', amount, 0)
      setFieldTouched('amount', true)
    }
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      values: { amount, price, limit },
      setFieldTouched,
      errors,
      decimals,
    } = this.props

    if (
      (errors.amount === traidingErrorMessages[1] ||
        errors.total === traidingErrorMessages[1]) &&
      e.target.value > amount
    )
      return null

    const priceForCalculate =
      priceType !== 'market' && limit !== null ? limit : price

    const total = toFixedTrunc(e.target.value, decimals[0]) * priceForCalculate

    this.setFormatted('amount', e.target.value, 0)
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
      setFieldTouched,
      validateForm,
      priceType,
      byType,
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
      this.setFormatted('amount', baseQuantity, 0)
    } else {
      const quoteQuantity = getQuoteQuantityFromBase({
        baseQuantity: funds[0].quantity,
        price: priceForCalculate,
        percentage: value,
      })

      this.setFormatted('total', quoteQuantity, 1)
      this.setFormatted('amount', funds[0].quantity * value, 0)
    }

    setFieldTouched('amount', true)
    setFieldTouched('total', true)
    validateForm()
  }

  render() {
    const {
      pair,
      funds,
      changePercentage,
      operationType,
      priceType,
      theme: { palette },
      values,
      handleSubmit,
      touched,
      errors,
      validateForm,
    } = this.props

    const pairsErrors = toPairs(errors)
    const isBuyType = operationType === 'buy'

    const firstValuePair =
      stripDigitPlaces(funds[0].value) === null
        ? funds[0].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[0].value))

    const secondValuePair =
      stripDigitPlaces(funds[1].value) === null
        ? funds[1].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[1].value))

    return (
      <Container background={'transparent'}>
        <div>
          <GridContainer key={pair}>
            <Grid container style={{ borderBottom: '1px solid #e0e5ec' }}>
              <Grid item container xs={12}>
                <BalanceTitle item xs={4}>
                  balances
                </BalanceTitle>

                <BalanceItem item xs={4}>
                  <TradingItemTitle>{pair[0]}</TradingItemTitle>
                  <TradingItemValue>
                    {funds[0].quantity.toFixed(8)}
                    <TradingItemSubValue>
                      {`$${firstValuePair}`}
                    </TradingItemSubValue>
                  </TradingItemValue>
                </BalanceItem>

                <BalanceItem item xs={4} lastItem>
                  <TradingItemTitle>{pair[1]}</TradingItemTitle>
                  <TradingItemValue>
                    {funds[1].quantity.toFixed(8)}
                    <TradingItemSubValue>
                      {`$${secondValuePair}`}
                    </TradingItemSubValue>
                  </TradingItemValue>
                </BalanceItem>
              </Grid>

              <PaddingGrid item container xs={12}>
                <TradeInputContainer
                  title={`Amount`}
                  value={values.amount}
                  onChange={this.onAmountChange}
                  coin={pair[0]}
                />
              </PaddingGrid>

              <PercentageGrid item container xs={12}>
                <PercentageItem
                  // active={percentage === '25'}
                  onClick={() => {
                    changePercentage('25')
                    this.onPercentageClick(0.25)
                  }}
                >
                  25%
                </PercentageItem>
                <PercentageItem
                  // active={percentage === '50'}
                  onClick={() => {
                    changePercentage('50')
                    this.onPercentageClick(0.5)
                  }}
                >
                  50%
                </PercentageItem>
                <PercentageItem
                  // active={percentage === '75'}
                  onClick={() => {
                    changePercentage('75')
                    this.onPercentageClick(0.75)
                  }}
                >
                  75%
                </PercentageItem>
                <PercentageItem
                  // active={percentage === '100'}
                  onClick={() => {
                    changePercentage('100')
                    this.onPercentageClick(1)
                  }}
                >
                  100%
                </PercentageItem>
              </PercentageGrid>

              {priceType === 'stop-limit' ? (
                <>
                  <PriceContainer xs={12} key={'stop-limit'}>
                    <TradeInputContainer
                      title={'Stop price'}
                      coin={pair[1]}
                      value={values.stop}
                      onChange={this.onStopChange}
                    />
                  </PriceContainer>
                </>
              ) : null}

              {priceType !== 'market' ? (
                <PriceContainer xs={12} key={'limit-price'}>
                  <TradeInputContainer
                    title={'Limit price'}
                    value={values.limit}
                    onChange={this.onLimitChange}
                    coin={pair[1]}
                  />
                </PriceContainer>
              ) : null}
            </Grid>

            <PaddingGrid xs={12} item container direction="column">
              <TradeInputContainer
                title={`Total ${pair[1]}`}
                value={values.total}
                onChange={this.onTotalChange}
                coin={pair[1]}
              />
            </PaddingGrid>

            <Grid xs={12}>
              <FormError hidden={!pairsErrors.length}>
                {pairsErrors.length ? pairsErrors[0][1] : '\u00A0'}
              </FormError>
            </Grid>

            <Grid xs={12}>
              <PlaseOrderDialog
                typeIsBuy={isBuyType}
                handleSubmit={handleSubmit}
                errors={errors}
                pairsErrors={pairsErrors}
                touched={touched}
                amount={values.amount}
                validateForm={validateForm}
                battonText={`send ${operationType} order`}
                text={
                  priceType === 'stop-limit'
                    ? `If the last price drops to or below ${values.stop} ${
                        pair[1]
                      },
                  an order to ${isBuyType ? 'Buy' : 'Sell'} ${values.amount} ${
                        pair[0]
                      } at a price of ${values.limit} ${
                        pair[1]
                      } will be placed.`
                    : priceType === 'limit'
                    ? `An order to ${isBuyType ? 'Buy' : 'Sell'} ${
                        values.amount
                      } ${pair[0]} at a price of ${values.price} ${
                        pair[1]
                      } will be placed.`
                    : `An order to ${isBuyType ? 'Buy' : 'Sell'} ${
                        values.amount
                      } ${pair[0]} at a market price will be placed.`
                }
              />
            </Grid>
          </GridContainer>
        </div>
      </Container>
    )
  }
}

const validate = (values: FormValues, props: IProps) => {
  const { priceType, byType, funds, marketPrice } = props

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
                  .max(funds[0].quantity, traidingErrorMessages[1])
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
                  .max(funds[0].quantity, traidingErrorMessages[1])
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
                  .max(funds[0].quantity, traidingErrorMessages[1])
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
    const { byType, priceType } = props
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
      const result = await props.confirmOperation(
        byType,
        priceType,
        filtredValues
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
