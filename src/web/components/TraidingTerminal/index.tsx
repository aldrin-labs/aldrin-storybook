import React, { PureComponent, SyntheticEvent } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import Yup from 'yup'


import {
  Grid,
  TextField,
  InputAdornment,
  Typography,
} from '@material-ui/core'

import { PlaseOrderDialog } from '../PlaseOrderDialog'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import {
  IProps,
  FormValues,
  IPropsWithFormik,
  priceType,
} from './types'

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
} from './styles'
import { toNumber } from 'lodash-es';
import {CSS_CONFIG} from '@sb/config/cssConfig'

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

// function is removing all decimals after set number without rounding
const toFixedTrunc = (value, n) => {
  const v = value.toString().split('.');
  if (n <= 0) return v[0];
  let f = v[1] || '';
  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
  while (f.length < n) f += '0';
  return `${v[0]}.${f}`
}

@withTheme()

class TraidingTerminal extends PureComponent<IPropsWithFormik> {

  componentWillReceiveProps(newProps: IPropsWithFormik) {
    if (this.props.priceType !== newProps.priceType) {
      this.props.setTouched([])
    }
  }

  setFormatted = (fild: priceType, value: any, index: number) => {
    const {
      decimals = [8, 8],
      setFieldValue,
    } = this.props
    const numberValue = toNumber(value)
    if (value === '') setFieldValue(fild, '', false)
    else if (
        value.toString().split('.')[1]
        && value.toString().split('.')[1].length > decimals[index]
        ) {
          setFieldValue(fild, toFixedTrunc(numberValue, decimals[index]), false)
        }
     else setFieldValue(fild, numberValue, false)
  }

  onStopChange = (e: SyntheticEvent<Element>) => {
    const {
      setFieldTouched,
    } = this.props
    this.setFormatted('stop', e.target.value, 1)
    setFieldTouched('stop', true)
  }

  onTotalChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      values,
      setFieldTouched,
      errors,
    } = this.props
    if(
      (errors.amount === 'Your balance is not enough'
      || errors.total === 'Your balance is not enough')
      && e.target.value > values.total) return null
    const price = priceType === 'limit' ? values.price : values.limit
    if(price && price !== '') {
      const amount = e.target.value / price
      this.setFormatted('amount', amount, 0)
      setFieldTouched('amount', true)
    }
    this.setFormatted('total', e.target.value, 1)
    setFieldTouched('total', true)
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      values,
      setFieldTouched,
      errors,
    } = this.props
    if(
      (errors.amount === 'Your balance is not enough'
      || errors.total === 'Your balance is not enough')
      && e.target.value > values.amount) return null
    const total = priceType === 'limit'
      ? e.target.value * values.price
      : priceType === 'stop-limit'
      ? e.target.value * values.limit
      : 0
    this.setFormatted('amount', e.target.value, 0)
    setFieldTouched('amount', true)
    if (priceType !== 'market') {
      this.setFormatted('total', total, 1)
      setFieldTouched('total', true)
    }
  }

  onPriceChange = (e: SyntheticEvent<Element>) => {
    const {
      values,
      setFieldTouched,
    } = this.props
    this.setFormatted('price', e.target.value, 1)
    const total = e.target.value * values.amount
    this.setFormatted('total', total, 1)
    setFieldTouched('price', true)
    setFieldTouched('total', true)
  }

  onLimitChange = (e: SyntheticEvent<Element>) => {
    const {
      values,
      setFieldTouched,
    } = this.props
    const total = e.target.value * values.amount
    this.setFormatted('limit', e.target.value, 1)
    this.setFormatted('total', total, 1)
    setFieldTouched('limit', true)
    setFieldTouched('total', true)
  }

  onPercentageClick = async (value: number) => {
    const {
      walletValue,
      values,
      setFieldTouched,
      validateForm,
      priceType,
      byType,
    } = this.props
    if (byType === 'buy') {
      await this.setFormatted('total', walletValue * value, 1)
      await this.setFormatted('amount', walletValue * value / (priceType === 'stop-limit'
        ? values.limit
        : values.price), 0)
    } else {
      await this.setFormatted('total', walletValue * value / (priceType === 'stop-limit'
        ? values.limit
        : values.price), 1)
      await this.setFormatted('amount', walletValue * value, 0)
    }
    setFieldTouched('amount', true)
    setFieldTouched('total', true)
    validateForm()
  }

render() {
  const {
    pair,
    walletValue,
    byType,
    priceType,
    theme: { palette },
    values,
    handleSubmit,
    touched,
    errors,
    validateForm,
    decimals,
  } = this.props

  const { background, divider } = palette

  const typeIsBuy = byType === 'buy'
  return (
    <Container background={background.default}>
      <div>
        <NameHeader background={background.default} border={divider}>
          <Grid container spacing={0}>
          <Grid item xs={1}>
            {''}
          </Grid>
          <Grid item xs={5}>
          <TypographyWithCustomColor
            textColor
            noWrap
            variant="subtitle2"
            fontSize={CSS_CONFIG.chart.headCell.fontSize}
          >
            {
              typeIsBuy
              ? `Buy ${pair[0]}`
              : `Sell ${pair[0]}`
            }
          </TypographyWithCustomColor>
          </Grid>
          <Grid item xs={6}>
            <TypographyWithCustomColor
              align="right"
              textColor
              variant="subtitle2"
              fontSize={CSS_CONFIG.chart.headCell.fontSize}
              noWrap
            >
              {`${walletValue} ${
                typeIsBuy
                  ? pair[1]
                  : pair[0]
                }`}
            </TypographyWithCustomColor>
            </Grid>
            </Grid>
        </NameHeader>
      <GridContainer>
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="body2"
            fontSize={CSS_CONFIG.chart.content.fontSize}
          >
            {priceType === 'stop-limit'
              ? 'Stop:'
              : 'Price:'}
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        {priceType === 'stop-limit'
        ? <InputTextField
          fullWidth
          name="stop"
          value={values.stop}
          id="stop"
          type="number"
          onChange={this.onStopChange}
          endAdornment={<InputAdornment position="end">{pair[1]}</InputAdornment>}
          helperText={
            touched.stop &&
            errors.stop && (
              <FormError>{errors.stop}</FormError>
            )
          }
        />
        : <InputTextField
            fullWidth
            id="price"
            name="price"
            type={priceType === 'market' ? 'string' : 'number'} // if priceType is market we show Market Price in price
            value={priceType === 'market' ? 'Market Price' : values.price}
            onChange={this.onPriceChange}
            endAdornment={<InputAdornment position="end">{pair[1]}</InputAdornment>}
            disabled={priceType === 'market'}
            helperText={
              touched.price &&
              errors.price && (
                <FormError>{errors.price}</FormError>
              )
            }
        />}
        </InputContainer>
        </Grid>
        {priceType === 'stop-limit' &&
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="body2"
            fontSize={CSS_CONFIG.chart.content.fontSize}
          >
            Limit:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        }
        {priceType === 'stop-limit' &&
        <Grid item xs={9}>
        <InputContainer>
        <InputTextField
          fullWidth
          id="limit"
          name="limit"
          value={values.limit}
          onChange={this.onLimitChange}
          type="number"
            endAdornment={<InputAdornment position="end">{pair[1]}</InputAdornment>}
          helperText={
            touched.limit &&
            errors.limit && (
              <FormError>{errors.limit}</FormError>
            )
          }
        />
        </InputContainer>
        </Grid>
        }
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="body2"
            fontSize={CSS_CONFIG.chart.content.fontSize}
          >
            Amount:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <InputTextField
          fullWidth
          id="amount"
          name="amount"
          value={values.amount}
          onChange={this.onAmountChange}
          type="number"
          endAdornment={<InputAdornment position="end">{pair[0]}</InputAdornment>}
          helperText={
            touched.amount &&
            errors.amount && (
              <FormError>{errors.amount}</FormError>
            )
          }
        />
        </InputContainer>
        </Grid>
        <Grid container spacing={8}>
          <Grid item sm={3} xs={6}>
            <ButtonContainer>
              <PriceButton onClick={() => this.onPercentageClick(0.25)}>
                25%
              </PriceButton>
            </ButtonContainer>
          </Grid>
          <Grid item sm={3} xs={6}>
            <ButtonContainer>
              <PriceButton onClick={() => this.onPercentageClick(0.50)}>
                50%
              </PriceButton>
            </ButtonContainer>
          </Grid>
          <Grid item sm={3} xs={6}>
            <ButtonContainer>
              <PriceButton onClick={() => this.onPercentageClick(0.75)}>
                75%
              </PriceButton>
            </ButtonContainer>
          </Grid>
          <Grid item sm={3} xs={6}>
            <ButtonContainer>
              <PriceButton onClick={() => this.onPercentageClick(1)}>
                100%
              </PriceButton>
            </ButtonContainer>
          </Grid>
        </Grid>
        {priceType !== 'market' &&
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="body2"
            fontSize={CSS_CONFIG.chart.content.fontSize}
          >
            Total:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>}
        {priceType !== 'market' &&
        <Grid item xs={9}>
          <InputContainer>
            <InputTextField
              fullWidth
              value={values.total}
              onChange={this.onTotalChange}
              id="total"
              name="total"
              type="number"
              endAdornment={
                (<InputAdornment position="end">{pair[1]}</InputAdornment>)
              }
              helperText={
                touched.total &&
                errors.total && (
                  <FormError>{errors.total}</FormError>
                )
              }
            />
          </InputContainer>
        </Grid>}
        <Grid item xs={12}>
          <ByButtonContainer>
            <PlaseOrderDialog
              typeIsBuy={typeIsBuy}
              handleSubmit={handleSubmit}
              errors={errors}
              touched={touched}
              amount={values.amount}
              validateForm={validateForm}
              battonText={
                typeIsBuy
                ? `Buy ${pair[0]}`
                : `Sell ${pair[0]}`
              }
              text={priceType === 'stop-limit'
              ? `If the last price drops to or below ${values.stop} ${pair[1]},
                  an order to ${typeIsBuy? 'Buy': 'Sell'} ${values.amount} ${pair[0]} at a price of ${values.limit} ${pair[1]} will be placed.`
              : priceType === 'limit'
              ? `An order to ${typeIsBuy? 'Buy': 'Sell'} ${values.amount} ${pair[0]} at a price of ${values.price} ${pair[1]} will be placed.`
              : `An order to ${typeIsBuy? 'Buy': 'Sell'} ${values.amount} ${pair[0]} at a market price will be placed.`
            }
              />
          </ByButtonContainer>
        </Grid>
      </Grid>
      </GridContainer>
      </div>
    </Container>
  )
  }
}

const validate = (values: FormValues, props: IProps) => {
  const {
    priceType,
    byType,
    walletValue,
    marketPrice,
  } = props
  const validationSchema = priceType === 'limit'
    ? Yup.object().shape({
      price: Yup.number()
      .nullable(true)
      .required()
      .moreThan(0),
      amount: byType === 'sell'
      ? Yup.number()
      .nullable(true)
      .required()
      .moreThan(0)
      .max(walletValue, 'Your balance is not enough')
      : Yup.number()
      .nullable(true)
      .required()
      .moreThan(0),
      total: byType === 'buy'
      ? Yup.number()
      .nullable(true)
      .required()
      .moreThan(0)
      .max(walletValue, 'Your balance is not enough')
      : Yup.number()
      .nullable(true)
      .required()
      .moreThan(0),
  })
  : priceType === 'market'
  ? Yup.object().shape({
    amount: byType === 'sell'
    ? Yup.number()
    .nullable(true)
    .required()
    .moreThan(0)
    .max(walletValue, 'Your balance is not enough')
    : Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
    total: byType === 'buy'
    ? Yup.number()
    .nullable(true)
    .required()
    .moreThan(0)
    .max(walletValue, 'Your balance is not enough')
    : Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
  })
  : Yup.object().shape({
    stop: Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
    limit: Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
    amount: byType === 'sell'
    ? Yup.number()
    .nullable(true)
    .required()
    .moreThan(0)
    .max(walletValue, 'Your balance is not enough')
    : Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
    total: byType === 'buy'
    ? Yup.number()
    .nullable(true)
    .required()
    .moreThan(0)
    .max(walletValue, 'Your balance is not enough')
    : Yup.number()
    .nullable(true)
    .required()
    .moreThan(0),
  })

  try {
    validateYupSchema(values, validationSchema, true);
  } catch (err) {
    return yupToFormErrors(err);
  }

  return {};
}

const formikEnhancer = withFormik<IProps, FormValues>({
  validate: validate,
  mapPropsToValues: (props) => ({
    price: props.marketPrice,
    stop: null,
    limit: null,
    amount: null,
    total: null,
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const {byType, priceType} = props
    if (priceType || byType) {
      const filtredValues = priceType === 'limit'
      ? {price: values.price, amount: values.amount}
      : priceType === 'market'
      ? {amount: values.amount}
      : {
          stop: values.stop,
          limit: values.limit,
          amount: values.amount,
        }
      props.confirmOperation(byType, priceType, filtredValues)
      resetForm()
      setSubmitting(false)
    }
  },
})


export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
