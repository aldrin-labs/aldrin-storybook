import React, { PureComponent, SyntheticEvent } from 'react'
import Yup from 'yup'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'
import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import { Grid, InputAdornment, Typography } from '@material-ui/core'
import { Loading } from '@sb/components/index'

import { toNumber, toPairs } from 'lodash-es'
import { traidingErrorMessages } from '@core/config/errorMessages'
import { IProps, FormValues, IPropsWithFormik, priceType } from './types'

import {
  getBaseQuantityFromQuote,
  getQuoteQuantityFromBase,
} from '@core/utils/chartPageUtils'

import BlueSlider from '@sb/components/Slider/BlueSlider'

import {
  Container,
  GridContainer,
  Coin,
  UpdatedCoin,
  InputTitle,
  InputWrapper,
  TradeInputBlock,
  TradeInput,
  BlueInputTitle,
  SeparateInputTitle,
  AbsoluteInputTitle,
} from './styles'
import { SendButton } from '../TraidingTerminal/styles'
import { Line } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'

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

const TradeInputHeader = ({
  title = 'Input',
  padding = '0 0 .8rem 0',
  needLine = true,
  needRightValue = false,
  rightValue = 'Value',
  onValueClick = () => {},
}) => {
  return (
    <InputRowContainer
      justify={needRightValue ? 'space-between' : 'flex-start'}
      padding={padding}
    >
      <SeparateInputTitle>{title}</SeparateInputTitle>
      {needLine && <Line />}
      {needRightValue && (
        <BlueInputTitle onClick={() => onValueClick()}>
          {rightValue}
        </BlueInputTitle>
      )}
    </InputRowContainer>
  )
}

const TradeInputContent = ({
  isValid = true,
  coinText = '',
  value = '',
  type = 'number',
  pattern = '',
  step = '',
  padding = '0',
  textAlign = 'right',
  onChange = () => {},
  needTitle = false,
  title = '',
  disabled = false,
}) => {
  return (
    <InputRowContainer padding={padding} style={{ position: 'relative' }}>
      {needTitle && <AbsoluteInputTitle>{title}</AbsoluteInputTitle>}
      <TradeInput
        align={textAlign}
        type={type}
        pattern={pattern}
        step={step}
        isValid={isValid}
        value={value}
        disabled={disabled}
        onChange={onChange}
        needPadding={coinText !== ''}
      />
      <UpdatedCoin>{coinText}</UpdatedCoin>
    </InputRowContainer>
  )
}

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
  state = {
    marketPrice: null,
    priceFromOrderbook: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.priceType !== this.props.priceType) {
      const {
        priceType,
        marketPrice,
        leverage,
        values: { amount, price, limit },
      } = this.props

      const priceForCalculate = priceType !== 'market' ? price : marketPrice

      this.setFormatted('total', amount * priceForCalculate, 1)
      this.onMarginChange({
        target: { value: ((amount / leverage) * priceForCalculate).toFixed(2) },
      })
    }

    if (
      this.state.priceFromOrderbook !== this.props.priceFromOrderbook &&
      this.props.priceType !== 'market'
    ) {
      const {
        priceFromOrderbook,
        values: { amount },
      } = this.props

      this.setFormatted('price', priceFromOrderbook, 1)
      this.setFormatted('total', amount * priceFromOrderbook, 1)
      this.setState({ priceFromOrderbook })
    }

    if (this.props.leverage !== prevProps.leverage) {
      this.onMarginChange({ target: { value: this.props.values.margin } })
    }
  }

  setFormatted = (fild: marketPriceType, value: any, index: number) => {
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
      marketPrice,
      values: { price },
      setFieldTouched,
      errors,
      funds,
      decimals,
    } = this.props

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    this.setFormatted('total', e.target.value, 1)
    setFieldTouched('total', true)

    if (priceForCalculate) {
      const amount = e.target.value / priceForCalculate

      this.setFormatted('amount', amount.toFixed(8), 0)
      setFieldTouched('amount', true)
    }
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      isSPOTMarket,
      leverage,
      marketPrice,
      setFieldValue,
      values: { price, limit },
      setFieldTouched,
    } = this.props

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    const total = e.target.value * priceForCalculate

    const newMargin = ((e.target.value / leverage) * priceForCalculate).toFixed(
      2
    )

    this.setFormatted('margin', newMargin, 1)

    setFieldValue('amount', e.target.value)
    setFieldTouched('amount', true)

    this.setFormatted('total', total, 1)
    setFieldTouched('total', true)
  }

  onPriceChange = (e: SyntheticEvent<Element>) => {
    const {
      values: { limit, amount },
      setFieldTouched,
      marketPrice,
      priceType,
      leverage,
    } = this.props
    const priceForCalculate =
      priceType !== 'market' ? e.target.value : marketPrice

    this.setFormatted('price', e.target.value, 1)
    const total = e.target.value * amount
    this.setFormatted('total', total, 1)

    const newMargin = ((amount / leverage) * priceForCalculate).toFixed(2)

    this.setFormatted('margin', newMargin, 1)

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

  onMarginChange = (e) => {
    const {
      values: { limit, amount, price },
      setFieldTouched,
      marketPrice,
      priceType,
      setFieldValue,
      leverage,
      funds,
    } = this.props
    const value =
      e.target.value > funds[1].quantity
        ? funds[1].quantity.toFixed(2)
        : e.target.value

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    const newAmount = (value * leverage) / priceForCalculate
    const newTotal = value * leverage

    setFieldValue('margin', value)
    setFieldValue('amount', newAmount.toFixed(3))
    setFieldValue('total', newTotal.toFixed(8))
  }

  onPercentageClick = (value: number) => {
    const {
      values: { limit, price },
      funds,
      marketPrice,
      setFieldValue,
      setFieldTouched,
      validateForm,
      priceType,
      byType,
      isSPOTMarket,
      leverage,
    } = this.props

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

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
        : (necessaryFund.quantity / priceForCalculate) * value

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
      marketPrice,
      funds,
      leverage,
      operationType,
      priceType,
      isSPOTMarket,
      values,
      handleSubmit,
      validateForm,
      setFieldValue,
      orderIsCreating,
    } = this.props

    if (!funds) return null

    const isBuyType = operationType === 'buy'

    const priceForCalculate =
      priceType !== 'market' && values.limit !== null
        ? values.price
        : marketPrice

    let maxAmount = 0

    if (isSPOTMarket) {
      maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity
    } else {
      maxAmount = funds[1].quantity * leverage
    }

    const maxSpotAmount = isBuyType
      ? (maxAmount / priceForCalculate).toFixed(8)
      : maxAmount.toFixed(8)

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={pair}>
          <Grid item container xs={9} style={{ maxWidth: '100%' }}>
            <InputRowContainer
              direction="column"
              style={{ margin: 'auto 0', width: '100%' }}
            >
              {priceType !== 'market' ? (
                <InputRowContainer
                  key={'limit-price'}
                  padding={'.6rem 0'}
                  direction={'column'}
                >
                  <TradeInputContent
                    needTitle
                    title={`price (${pair[1]})`}
                    value={values.price || ''}
                    onChange={this.onPriceChange}
                    coinText={pair[1]}
                  />
                </InputRowContainer>
              ) : null}

              {priceType === 'stop-limit' || priceType === 'take-profit' ? (
                <InputRowContainer
                  key={'stop-limit'}
                  padding={'.6rem 0'}
                  direction={'column'}
                >
                  <TradeInputContent
                    needTitle
                    title={`trigger price (${pair[1]})`}
                    value={values.stop || ''}
                    onChange={this.onStopChange}
                    coinText={pair[1]}
                  />
                </InputRowContainer>
              ) : null}

              <InputRowContainer
                direction="column"
                key={'amount'}
                padding={'.6rem 0'}
                justify={priceType === 'market' ? 'flex-end' : 'center'}
              >
                {/* <TradeInputHeader
                  title={`${isSPOTMarket ? `Amount` : 'qtty'} (${pair[0]})`}
                  needLine={false}
                  needRightValue={true}
                  rightValue={`${maxSpotAmount} ${pair[0]}`}
                  onValueClick={() =>
                    this.onAmountChange({
                      target: {
                        value: maxSpotAmount,
                      },
                    })
                  }
                /> */}

                {isSPOTMarket ? (
                  <TradeInputContent
                    needTitle
                    title={`${isSPOTMarket ? 'amount' : 'order quantity'} (${
                      pair[0]
                    })`}
                    value={values.amount || ''}
                    type={'text'}
                    pattern={
                      isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                    }
                    onChange={this.onAmountChange}
                    coinText={pair[0]}
                  />
                ) : (
                  <InputRowContainer direction="row" padding={'0'}>
                    <div style={{ width: '50%', paddingRight: '2.5%' }}>
                      <TradeInputContent
                        needTitle
                        title={`size (${pair[0]})`}
                        value={values.amount || ''}
                        type={'text'}
                        pattern={
                          isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                        }
                        onChange={this.onAmountChange}
                        coinText={pair[0]}
                      />
                    </div>
                    <div style={{ width: '50%', paddingLeft: '2.5%' }}>
                      <TradeInputContent
                        disabled={true}
                        value={values.total || ''}
                        onChange={this.onTotalChange}
                        coinText={pair[1]}
                      />
                    </div>
                  </InputRowContainer>
                )}

                <BlueSlider
                  value={
                    isBuyType || !isSPOTMarket
                      ? values.total / (maxAmount / 100)
                      : values.amount / (maxAmount / 100)
                  }
                  sliderContainerStyles={{
                    width: 'calc(100% - 1rem)',
                    margin: '0 .5rem',
                    padding: '.9rem 0 0 0',
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

                    const fixedAmount = isSPOTMarket
                      ? newAmount.toFixed(8)
                      : newAmount.toFixed(3)

                    const newMargin = (
                      (funds[1].quantity * value) /
                      100
                    ).toFixed(2)

                    setFieldValue('amount', fixedAmount)
                    setFieldValue('total', newTotal.toFixed(8))
                    setFieldValue('margin', newMargin)
                  }}
                />
              </InputRowContainer>

              {isSPOTMarket && (
                <InputRowContainer
                  key={'total'}
                  padding={'.6rem 0'}
                  direction={'column'}
                >
                  <TradeInputContent
                    needTitle
                    title={`total (${pair[1]})`}
                    value={values.total || ''}
                    onChange={this.onTotalChange}
                    coinText={pair[1]}
                  />
                </InputRowContainer>
              )}

              {!isSPOTMarket && (
                <InputRowContainer
                  key={'cost'}
                  padding={'.6rem 0'}
                  direction={'column'}
                  justify="flex-end"
                >
                  {/* <InputTitle>cost:</InputTitle>
                      <InputTitle color="#16253D" style={{ width: 'auto' }}>
                        {(
                          (values.amount / leverage) *
                          priceForCalculate
                        ).toFixed(2)}{' '}
                        {pair[1]}
                      </InputTitle> */}
                  <TradeInputContent
                    needTitle
                    disabled={priceType === 'market'}
                    title={`margin (${pair[1]})`}
                    value={values.margin || ''}
                    type={'text'}
                    pattern={'[0-9]+.[0-9]{2}'}
                    onChange={this.onMarginChange}
                    coinText={pair[1]}
                  />
                  {/* <Grid
                      container
                      justify="space-between"
                      style={{ padding: '.6rem 0' }}
                    >
                      <InputTitle>max buy:</InputTitle>
                      <InputTitle color="#16253D" style={{ width: 'auto' }}>
                        {priceForCalculate
                          ? (
                              (funds[1].quantity * leverage) /
                              priceForCalculate
                            ).toFixed(3)
                          : 0}{' '}
                        {pair[0]}
                      </InputTitle>
                    </Grid> */}
                </InputRowContainer>
              )}
            </InputRowContainer>
          </Grid>

          <Grid
            xs={3}
            item
            container
            style={{ maxWidth: '100%', paddingBottom: '1.5rem' }}
          >
            <Grid xs={12} item container alignItems="center">
              <SendButton
                disabled={orderIsCreating === operationType}
                type={operationType}
                onClick={async () => {
                  const result = await validateForm()
                  if (Object.keys(result).length === 0 || !isSPOTMarket) {
                    handleSubmit(values)
                  }
                }}
              >
                {orderIsCreating === operationType ? (
                  <div>
                    <Loading
                      color={'#fff'}
                      size={24}
                      style={{ height: '24px' }}
                    />
                  </div>
                ) : isSPOTMarket ? (
                  operationType === 'buy' ? (
                    `buy ${pair[0]}`
                  ) : (
                    `sell ${pair[0]}`
                  )
                ) : operationType === 'buy' ? (
                  'buy/long'
                ) : (
                  'sell/short'
                )}
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
    margin: null,
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const {
      byType,
      priceType,
      isSPOTMarket,
      reduceOnly,
      orderMode,
      TIFMode,
      trigger,
      leverage,
    } = props

    if (priceType || byType) {
      const filtredValues =
        priceType === 'limit'
          ? { limit: values.limit, price: values.price, amount: values.amount }
          : marketPriceType === 'market'
          ? { amount: values.amount }
          : {
              stop: values.stop,
              limit: values.limit,
              amount: values.amount,
            }

      // const priceForCalculate =
      //   priceType !== 'market' && values.limit !== null
      //     ? values.limit
      //     : values.price

      // if (values.amount * priceForCalculate < 10 && isSPOTMarket) {
      //   props.showOrderResult(
      //     {
      //       status: 'error',
      //       message: 'Total value must be at least 10.',
      //     },
      //     props.cancelOrder,
      //     isSPOTMarket ? 0 : 1
      //   )

      //   return null
      // }

      await props.addLoaderToButton(byType)

      const result = await props.confirmOperation(
        byType,
        priceType,
        filtredValues,
        'default',
        {},
        {
          leverage,
          marketType: isSPOTMarket ? 0 : 1,
          ...(priceType !== 'market'
            ? orderMode === 'TIF'
              ? { timeInForce: TIFMode, postOnly: false }
              : { postOnly: true }
            : {}),
          ...(priceType === 'stop-limit' || priceType === 'take-profit'
            ? {
                workingType:
                  trigger === 'mark price' ? 'MARK_PRICE' : 'CONTRACT_PRICE',
              }
            : {}),
          ...(priceType !== 'stop-limit' && priceType !== 'take-profit'
            ? { reduceOnly }
            : {}),
        }
      )

      await props.showOrderResult(
        result,
        props.cancelOrder,
        isSPOTMarket ? 0 : 1
      )
      await await props.addLoaderToButton(false)
      setSubmitting(false)
    }
  },
})

export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
