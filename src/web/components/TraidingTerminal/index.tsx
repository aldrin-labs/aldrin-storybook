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

const TradeInputContainer = ({ title, value, onChange, coin, style }) => {
  return (
    <TradeInputBlock style={style}>
      <InputTitle>{title}:</InputTitle>
      <InputWrapper>
        <TradeInput
          isValid={true}
          value={value}
          onChange={onChange}
          type="number"
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
  }

  setFormatted = (fild: priceType, value: any, index: number) => {
    const { decimals = [8, 8], setFieldValue } = this.props
    const numberValue = toNumber(value)

    // console.log('value', numberValue)
    // console.log('formatted', toFixedTrunc(numberValue, decimals[index]))
    // console.log(
    //   'condition',
    //   value.toString().split('.')[1] &&
    //   value.toString().split('.')[1].length > decimals[index]
    // )

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
      byType,
      values: { limit, price, total },
      setFieldTouched,
      errors,
      funds,
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
      percentage,
      changePercentage,
      operationType,
      priceType,
      isSPOTMarket,
      values,
      handleSubmit,
      touched,
      errors,
      validateForm,
    } = this.props

    const pairsErrors = toPairs(errors)
    const isBuyType = operationType === 'buy'

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={pair}>
          <Grid container item xs={9} style={{ maxWidth: '100%' }}>
            {priceType === 'stop-limit' ? (
              <PaddingGrid xs={12} conatiner key={'stop-limit'}>
                <TradeInputContainer
                  title={'Stop'}
                  coin={pair[1]}
                  value={values.stop}
                  onChange={this.onStopChange}
                />
              </PaddingGrid>
            ) : null}

            {priceType !== 'market' ? (
              <PriceContainer
                alignItems={priceType !== 'stop-limit' && 'flex-end'}
                xs={12}
                container
                key={'limit-price'}
              >
                <TradeInputContainer
                  title={'Price'}
                  value={values.limit}
                  onChange={this.onLimitChange}
                  coin={pair[1]}
                />
              </PriceContainer>
            ) : null}

            <Grid
              item
              container
              direction="column"
              justify={priceType === 'market' ? 'flex-end' : 'center'}
              xs={12}
            >
              <TradeInputContainer
                title={isSPOTMarket ? `Amount` : 'qtty'}
                value={values.amount}
                onChange={this.onAmountChange}
                coin={pair[0]}
                style={{ paddingBottom: '.8rem' }}
              />
              {/* todo: replace it with blueslider component */}
              <SmallSlider
                min={0}
                max={100}
                defaultValue={0}
                value={percentage}
                valueSymbol={'%'}
                marks={{
                  0: { label: '0%' },
                  25: { label: '25%' },
                  50: { label: '50%' },
                  75: { label: '75%' },
                  100: { label: '100%' },
                }}
                onChange={(value) => {
                  changePercentage(value)
                  this.onPercentageClick(value / 100)
                }}
                sliderContainerStyles={{
                  width: '70%',
                  margin: '0 0 0 auto',
                }}
                handleStyles={{
                  width: '1.2rem',
                  height: '1.2rem',
                  border: 'none',
                  backgroundColor: '#0B1FD1',
                  marginTop: '-.45rem',
                  boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                }}
                dotStyles={{
                  border: 'none',
                  backgroundColor: '#ABBAD1',
                }}
                activeDotStyles={{
                  backgroundColor: '#5C8CEA',
                }}
                markTextSlyles={{
                  color: '#7284A0;',
                  fontSize: '1rem',
                }}
              />
            </Grid>

            {isSPOTMarket && (
              <TotalGrid
                xs={12}
                item
                container
                direction="column"
                justify="center"
              >
                <TradeInputContainer
                  title={`Total`}
                  value={values.total}
                  onChange={this.onTotalChange}
                  coin={pair[1]}
                />
              </TotalGrid>
            )}

            {/* {pairsErrors.length > 0 && (
                <FormError>
                  {pairsErrors.length ? pairsErrors[0][1] : '\u00A0'}
                </FormError>
              )} */}

            {!isSPOTMarket && (
              <Grid xs={12} container justify="flex-end">
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
                      (qtty / lev) * price
                    </InputTitle>
                  </Grid>

                  <Grid
                    container
                    justify="space-between"
                    style={{ padding: '.6rem 0' }}
                  >
                    <InputTitle>max buy:</InputTitle>
                    <InputTitle color="#16253D" style={{ width: 'auto' }}>
                      value
                    </InputTitle>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid xs={3} item container style={{ maxWidth: '100%' }}>
            <Grid xs={1} item />
            <Grid xs={11} item container alignItems="center">
              <PlaseOrderDialog
                typeIsBuy={isBuyType}
                handleSubmit={handleSubmit}
                errors={errors}
                pairsErrors={pairsErrors}
                touched={touched}
                amount={values.amount}
                validateForm={validateForm}
                battonText={`${operationType} ${pair[0]}`}
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
          </Grid>
        </GridContainer>
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
