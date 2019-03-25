import React, { PureComponent } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import Yup from 'yup'


import { Grid, TextField, InputAdornment, Button, Typography } from '@material-ui/core'

import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'

import { IProps } from './types'

import {
  Container,
  NameHeader,
  InputContainer,
  TitleContainer,
  PriceButton,
  GridContainer,
  ButtonContainer,
  ByButtonContainer,
} from './styles'

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)
@withTheme()

class TraidingTerminal extends PureComponent<IProps> {
  onTotalChange = (e: any) => {
    const {
      values,
      setFieldValue,
    } = this.props
    const amount = e.target.value / values.price
    setFieldValue('total', e.target.value)
    setFieldValue('amount', amount, false)
  }

  onAmountChange = (e: any) => {
    const {
      values,
      setFieldValue,
    } = this.props
    const total = e.target.value * values.price
    setFieldValue('amount', e.target.value)
    setFieldValue('total', total, false)
  }

  onProcentageClick = (value: number) => {
    const {
      walletValue,
      values,
      setFieldValue,
    } = this.props
    setFieldValue('total', walletValue * value, false)
    setFieldValue('amount', walletValue * value / values.price, false)
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
  } = this.props



  const { background, primary, type } = palette

  const typeIsBuy = byType === 'buy'
  return (
    <Container background={background.default}>
      <div>
        <NameHeader background={primary[type]}>
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
            {`${walletValue} ${pair[1]}`}
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
            variant="subtitle2"
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
        ? <TextField
          fullWidth
          name="stop"
          value={values.stop || ''}
          id="stop"
          type="number"
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
          helperText={
            touched.stop &&
            errors.stop && (
              <FormError>{errors.stop}</FormError>
            )
          }
        />
        : <TextField
            fullWidth
            id="price"
            name="price"
            type={priceType === 'market' ? 'string' : 'number'}
            value={priceType === 'market' ? 'Market Price' : values.price || ''}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
            }}
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
            variant="subtitle2"
          >
            Limit:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        }
        {priceType === 'stop-limit' &&
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          fullWidth
          id="limit"
          name="limit"
          value={values.limit || ''}
          onChange={handleChange}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
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
            variant="subtitle2"
          >
            Amount:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>
        <Grid item xs={9}>
        <InputContainer>
        <TextField
          fullWidth
          id="amount"
          name="amount"
          value={values.amount || ''}
          onChange={onAmountChange}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
          }}
          helperText={
            touched.amount &&
            errors.amount && (
              <FormError>{errors.amount}</FormError>
            )
          }
        />
        </InputContainer>
        </Grid>
        <Grid item xs={3}>
          {''}
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={8}>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton onClick={() => {onProcentageClick(0.25)}}>
                  25%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton onClick={() => {onProcentageClick(0.50)}}>
                  50%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton onClick={() => {onProcentageClick(0.75)}}>
                  75%
                </PriceButton>
              </ButtonContainer>
            </Grid>
            <Grid item sm={3} xs={6}>
              <ButtonContainer>
                <PriceButton onClick={() => {onProcentageClick(1)}}>
                  100%
                </PriceButton>
              </ButtonContainer>
            </Grid>
          </Grid>
        </Grid>
        {priceType !== 'market' &&
        <Grid item xs={3}>
          <TitleContainer>
          <TypographyWithCustomColor
            textColor
            variant="subtitle2"
          >
            Total:
          </TypographyWithCustomColor>
          </TitleContainer>
        </Grid>}
        {priceType !== 'market' &&
        <Grid item xs={9}>
          <InputContainer>
            <TextField
              fullWidth
              value={values.total || ''}
              onChange={onTotalChange}
              id="total"
              name="total"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
              }}
            />
          </InputContainer>
        </Grid>}
        <Grid item xs={12}>
          <ByButtonContainer>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              >
              Buy
            </Button>
          </ByButtonContainer>
        </Grid>
      </Grid>
      </GridContainer>
      </div>
    </Container>
  )
  }
}

const validate = (values, props) => {
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
      .max(walletValue / values.price, 'Your balance is not enough'),
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
    .max(Math.max(walletValue / values.stop, walletValue / values.limit), 'Your balance is not enough'),
  })

  try {
    validateYupSchema(values, validationSchema, true);
  } catch (err) {
    return yupToFormErrors(err);
  }

  return {};
}

const formikEnhancer = withFormik({
  validate: validate,
  mapPropsToValues: (props: any) => ({
    price: props.marketPrice,
    stop: '',
    limit: '',
    amount: '',
    total: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const {byType, priceType, pair} = props
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
      props.handleSubmit(byType, priceType, pair, filtredValues)
    }
  },
})


export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
