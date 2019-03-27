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
  IPropsWithFormik
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

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)
@withTheme()

class TraidingTerminal extends PureComponent<IPropsWithFormik> {

  onTotalChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      values,
      setFieldValue,
    } = this.props
    const amount =priceType === 'limit'
    ? e.target.value / values.price
    : e.target.value / values.limit
    setFieldValue('total', toNumber(e.target.value))
    setFieldValue('amount', toNumber(amount), false)
  }

  onPriceChange = (e: SyntheticEvent<Element>) => {
    const {
      values,
      setFieldValue,
    } = this.props
    const total = e.target.value * values.amount
    setFieldValue('price',toNumber( e.target.value))
    setFieldValue('total', toNumber(total), false)
  }

  onLimitChange = (e: SyntheticEvent<Element>) => {
    const {
      values,
      setFieldValue,
    } = this.props
    const total = e.target.value * values.amount
    setFieldValue('limit', toNumber(e.target.value))
    setFieldValue('total', toNumber(total), false)
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      values,
      setFieldValue,
    } = this.props
    const total = priceType === 'limit'
      ? e.target.value * values.price
      : priceType === 'stop-limit'
      ? e.target.value * values.limit
      : 0
    setFieldValue('amount', toNumber(e.target.value))
    if (priceType !== 'market') setFieldValue('total', toNumber(total), false)
  }

  onPercentageClick = async (value: number) => {
    const {
      walletValue,
      values,
      setFieldValue,
      validateForm,
      priceType,
    } = this.props
    await setFieldValue('total', toNumber(walletValue * value), false)
    await setFieldValue('amount', toNumber(walletValue * value / (priceType === 'stop-limit'
      ? toNumber(values.limit)
      : toNumber(values.price))), false)
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
    handleChange,
    handleSubmit,
    touched,
    errors,
    validateForm,
  } = this.props

  const { background, primary, type, divider } = palette

  const typeIsBuy = byType === 'buy'
  return (
    <Container background={background.default}>
      <div>
        <NameHeader background={background.default} border={divider}>
          <Grid container spacing={0}>
          <Grid item xs={1}>
            {''}
          </Grid>
          <Grid item xs>
          <TypographyWithCustomColor
            textColor
            variant="subtitle1"
          >
            {
              typeIsBuy
              ? `Buy ${pair[0]}`
              : `Sell ${pair[0]}`
            }
          </TypographyWithCustomColor>
          </Grid>
          <Grid item xs>
            <TypographyWithCustomColor
              align="right"
              textColor
              variant="subtitle1"
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
          value={values.stop || ''}
          id="stop"
          type="number"
          onChange={handleChange}
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
            value={priceType === 'market' ? 'Market Price' : values.price || ''}
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
          value={values.limit || ''}
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
          value={values.amount || ''}
          onChange={this.onAmountChange}
          type="number"
          endAdornment={<InputAdornment position="end">{pair[0]}</InputAdornment>}
          helperText={
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
              value={values.total || ''}
              onChange={this.onTotalChange}
              id="total"
              name="total"
              type="number"
              endAdornment={
                (<InputAdornment position="end">{pair[1]}</InputAdornment>)
              }
            />
          </InputContainer>
        </Grid>}
        <Grid item xs={12}>
          <ByButtonContainer>
            <PlaseOrderDialog
              handleSubmit={handleSubmit}
              errors={errors}
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
    walletValue,
    marketPrice,
  } = props
  const validationSchema = priceType === 'limit'
    ? Yup.object().shape({
      price: Yup.number()
      .required()
      .min(0),
      amount: Yup.number()
      .required()
      .min(0)
      .max(walletValue / (
        typeof(values.price) === 'number'
        ? values.price
        : props.marketPrice), 'Your balance is not enough'),
  })
  : priceType === 'market'
  ? Yup.object().shape({
    amount: Yup.number()
    .required()
    .min(0)
    .max(walletValue / marketPrice, 'Your balance is not enough'),
  })
  : Yup.object().shape({
    stop: Yup.number()
    .required()
    .min(0),
    limit: Yup.number()
    .required()
    .min(0),
    amount: Yup.number()
    .required()
    .min(0)
    .max(Math.max(walletValue / (
      typeof(values.stop) === 'number'
        ? values.stop
        : props.marketPrice),
      walletValue / (
        typeof(values.limit) === 'number'
        ? values.limit
        : props.marketPrice)), 'Your balance is not enough'),
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
    stop: '',
    limit: '',
    amount: '',
    total: '',
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
      props.confirmOperation(filtredValues)
      resetForm()
      setSubmitting(false)
    }
  },
})


export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
