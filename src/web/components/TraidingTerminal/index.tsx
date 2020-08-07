import React, { PureComponent, SyntheticEvent, CSSProperties } from 'react'
import Yup from 'yup'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'
import { withSnackbar } from 'notistack'
import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import { Grid, InputAdornment, Typography, Theme } from '@material-ui/core'
import { Loading } from '@sb/components/index'

import { toNumber, toPairs } from 'lodash-es'
import { traidingErrorMessages } from '@core/config/errorMessages'
import { IProps, FormValues, IPropsWithFormik, priceType } from './types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
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
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

export const TradeInputHeader = ({
  title = 'Input',
  padding = '0 0 .8rem 0',
  needLine = true,
  lineMargin,
  needRightValue = false,
  rightValue = 'Value',
  haveTooltip = false,
  tooltipText = '',
  tooltipStyles = {},
  onValueClick = () => {},
}) => {
  return (
    <InputRowContainer
      justify={needRightValue ? 'space-between' : 'flex-start'}
      padding={padding}
    >
      {haveTooltip ? (
        <>
          {/* <TooltipContainer style={{ display: 'flex', cursor: 'pointer' }}> */}
          <DarkTooltip
            title={tooltipText}
            maxWidth={'30rem'}
            placement="top"
            enterDelay={10000}
          >
            <SeparateInputTitle
              haveTooltip={haveTooltip}
              style={{
                borderBottom: haveTooltip ? '.1rem dashed #e0e5ec' : 'none',
              }}
            >
              {title}
            </SeparateInputTitle>
          </DarkTooltip>
          {/* </TooltipContainer> */}
        </>
      ) : (
        <SeparateInputTitle
          style={{
            borderBottom: haveTooltip ? '.1rem dashed #e0e5ec' : 'none',
          }}
        >
          {title}
        </SeparateInputTitle>
      )}
      {/* <SeparateInputTitle
        style={{ borderBottom: haveTooltip ? '.1rem dashed #e0e5ec' : 'none' }}
      >
        {title}
      </SeparateInputTitle> */}
      {needLine && <Line lineMargin={lineMargin} />}
      {needRightValue && (
        <BlueInputTitle onClick={() => onValueClick()}>
          {rightValue}
        </BlueInputTitle>
      )}
    </InputRowContainer>
  )
}

export const TradeInputContent = ({
  isValid = true,
  showErrors = false,
  disabled = false,
  haveSelector = false,
  needTitle = false,
  needPreSymbol = false,
  symbolRightIndent = null,
  preSymbol = '',
  title = '',
  symbol = '',
  value = '',
  pattern = '',
  step = '',
  type = 'number',
  padding = '0',
  width = '100%',
  fontSize = '',
  textAlign = 'right',
  onChange = () => {},
  inputStyles,
  theme,
}: {
  isValid?: boolean
  showErrors?: boolean
  disabled?: boolean
  haveSelector?: boolean
  needTitle?: boolean
  needPreSymbol?: boolean
  preSymbol?: string
  title?: string
  symbol?: string
  value: string | number
  pattern?: string
  step?: string | number
  type?: string
  padding?: string | number
  width?: string | number
  fontSize?: string
  textAlign?: string
  onChange: any
  inputStyles?: CSSProperties
  theme?: Theme
}) => {
  return (
    <InputRowContainer
      padding={padding}
      width={width}
      style={{ position: 'relative' }}
    >
      {needTitle && (
        <AbsoluteInputTitle
          style={{ ...(fontSize ? { fontSize: fontSize } : {}) }}
        >
          {title}
        </AbsoluteInputTitle>
      )}
      {needPreSymbol ? (
        <UpdatedCoin style={{ width: 0 }} left={'2rem'}>
          {preSymbol}
        </UpdatedCoin>
      ) : null}
      <TradeInput
        theme={theme}
        align={textAlign}
        type={type}
        pattern={pattern}
        step={step}
        isValid={showErrors ? isValid : true}
        value={value}
        disabled={disabled}
        onChange={onChange}
        needPadding={symbol !== ''}
        haveSelector={haveSelector}
        style={{ ...inputStyles, ...(fontSize ? { fontSize: fontSize } : {}) }}
      />
      <UpdatedCoin
        theme={theme}
        right={
          !!symbolRightIndent
            ? symbolRightIndent
            : symbol.length <= 2
            ? '2.5rem'
            : '1rem'
        }
      >
        {symbol}
      </UpdatedCoin>
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

@withTheme()
class TraidingTerminal extends PureComponent<IPropsWithFormik> {
  state = {
    marketPrice: null,
    priceFromOrderbook: null,
  }

  componentDidUpdate(prevProps) {
    const {
      priceType,
      marketPrice,
      marketPriceAfterPairChange,
      values: { amount, price },
    } = this.props

    if (marketPriceAfterPairChange !== prevProps.marketPriceAfterPairChange) {
      this.onPriceChange({ target: { value: marketPriceAfterPairChange } })
    }

    if (prevProps.priceType !== priceType) {
      const { leverage, setFieldValue } = this.props

      const priceForCalculate = priceType !== 'market' ? price : marketPrice

      this.setFormatted('total', amount * priceForCalculate, 1)

      const newMargin = stripDigitPlaces(
        (amount / leverage) * priceForCalculate,
        3
      )

      setFieldValue('margin', newMargin)
    }

    if (
      this.state.priceFromOrderbook !== this.props.priceFromOrderbook &&
      priceType !== 'market'
    ) {
      const { priceFromOrderbook } = this.props

      this.setFormatted('price', priceFromOrderbook, 1)
      this.setFormatted('stop', priceFromOrderbook, 1)
      this.setFormatted('total', amount * priceFromOrderbook, 1)
      this.setState({ priceFromOrderbook })
    }

    if (this.props.leverage !== prevProps.leverage) {
      const priceForCalculate = priceType !== 'market' ? price : marketPrice

      this.onMarginChange({
        target: {
          value: stripDigitPlaces(
            (this.props.values.amount * priceForCalculate) /
              this.props.leverage,
            2
          ),
        },
      })
    }

    if (marketPrice !== prevProps.marketPrice && priceType === 'market') {
      const { leverage } = this.props

      const total = marketPrice * amount
      this.setFormatted('total', total, 1)

      const newMargin = stripDigitPlaces((amount / leverage) * marketPrice, 2)

      this.setFormatted('margin', newMargin, 1)
    }
  }

  setFormatted = (fild: marketPriceType, value: any, index: number) => {
    const { decimals = [8, 8], setFieldValue } = this.props
    const numberValue = toNumber(value)

    if (value === '') setFieldValue(fild, '', false)
    else if (numberValue.toString().includes('e')) {
      setFieldValue(fild, stripDigitPlaces(numberValue, 8), false)
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
    const { setFieldValue } = this.props
    setFieldValue('stop', e.target.value)
  }

  onTotalChange = (e: SyntheticEvent<Element>) => {
    const {
      priceType,
      byType,
      marketPrice,
      values: { price },
      setFieldTouched,
      isSPOTMarket,
      quantityPrecision,
      errors,
      funds,
      decimals,
    } = this.props

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    this.setFormatted('total', e.target.value, 1)

    if (priceForCalculate) {
      const amount = e.target.value / priceForCalculate

      this.setFormatted(
        'amount',
        stripDigitPlaces(amount, isSPOTMarket ? 8 : quantityPrecision),
        0
      )
    }
  }

  onAmountChange = (e: SyntheticEvent<Element>) => {
    const {
      funds,
      priceType,
      operationType,
      isSPOTMarket,
      leverage,
      marketPrice,
      setFieldValue,
      values: { price, limit },
      setFieldTouched,
      quantityPrecision,
    } = this.props

    const priceForCalculate = priceType !== 'market' ? price : marketPrice
    const isBuyType = operationType === 'buy'

    let maxAmount = 0

    if (isSPOTMarket) {
      maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity
    } else {
      maxAmount = funds[1].quantity * leverage
    }

    const currentMaxAmount =
      isBuyType || !isSPOTMarket ? maxAmount / priceForCalculate : maxAmount

    const isAmountMoreThanMax = e.target.value > currentMaxAmount

    const amountForUpdate = isAmountMoreThanMax
      ? currentMaxAmount
      : e.target.value

    const total = amountForUpdate * priceForCalculate

    const newMargin = stripDigitPlaces(
      (amountForUpdate / leverage) * priceForCalculate,
      2
    )

    const strippedAmount = isAmountMoreThanMax
      ? stripDigitPlaces(amountForUpdate, isSPOTMarket ? 8 : quantityPrecision)
      : e.target.value

    setFieldValue('amount', strippedAmount)
    setFieldValue('margin', stripDigitPlaces(newMargin, 3))
    setFieldValue('total', stripDigitPlaces(total, isSPOTMarket ? 8 : 3))
  }

  onPriceChange = (e: SyntheticEvent<Element>) => {
    const {
      values: { limit, amount },
      setFieldTouched,
      marketPrice,
      priceType,
      leverage,
      setFieldValue,
    } = this.props

    const priceForCalculate =
      priceType !== 'market' ? e.target.value : marketPrice

    setFieldValue('price', e.target.value)

    const total = e.target.value * amount
    this.setFormatted('total', total, 1)

    const newMargin = stripDigitPlaces(
      (amount / leverage) * priceForCalculate,
      2
    )

    this.setFormatted('margin', newMargin, 1)
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
      quantityPrecision,
      funds,
      isSPOTMarket,
    } = this.props

    const value =
      e.target.value > funds[1].quantity
        ? stripDigitPlaces(funds[1].quantity, 2)
        : e.target.value

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    const newAmount = (value * leverage) / priceForCalculate
    const newTotal = value * leverage

    setFieldValue('margin', value)
    setFieldValue(
      'amount',
      stripDigitPlaces(newAmount, isSPOTMarket ? 8 : quantityPrecision)
    )
    setFieldValue('total', stripDigitPlaces(newTotal, isSPOTMarket ? 8 : 2))
  }

  render() {
    const {
      pair,
      theme,
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
      lockedAmount,
      quantityPrecision,
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
    } else if (this.props.reduceOnly) {
      maxAmount = lockedAmount * priceForCalculate
    } else {
      maxAmount = funds[1].quantity * leverage
    }

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={`${pair[0]}/${pair[1]}`}>
          <Grid item container xs={8} style={{ maxWidth: '100%' }}>
            <InputRowContainer
              direction="column"
              style={{ margin: 'auto 0', width: '100%' }}
            >
              {priceType !== 'market' && priceType !== 'stop-market' ? (
                <InputRowContainer
                  key={'limit-price'}
                  padding={'.6rem 0'}
                  direction={'column'}
                >
                  <TradeInputContent
                    theme={theme}
                    needTitle
                    type={'text'}
                    title={`price (${pair[1]})`}
                    value={values.price || ''}
                    onChange={this.onPriceChange}
                    symbol={pair[1]}
                  />
                </InputRowContainer>
              ) : null}

              {priceType === 'stop-limit' || priceType === 'stop-market' ? (
                <InputRowContainer
                  key={'stop-limit'}
                  padding={'.6rem 0'}
                  direction={'column'}
                >
                  <TradeInputContent
                    theme={theme}
                    needTitle
                    type={'text'}
                    title={`trigger price (${pair[1]})`}
                    value={values.stop || ''}
                    onChange={this.onStopChange}
                    symbol={pair[1]}
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
                    theme={theme}
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
                    symbol={pair[0]}
                  />
                ) : (
                  <InputRowContainer direction="row" padding={'0'}>
                    <div style={{ width: '50%', paddingRight: '1%' }}>
                      <TradeInputContent
                        theme={theme}
                        needTitle
                        title={`size`}
                        value={values.amount || ''}
                        type={'text'}
                        pattern={
                          isSPOTMarket ? '[0-9]+.[0-9]{8}' : '[0-9]+.[0-9]{3}'
                        }
                        onChange={this.onAmountChange}
                        symbol={pair[0]}
                      />
                    </div>
                    <div style={{ width: '50%', paddingLeft: '1%' }}>
                      <TradeInputContent
                        theme={theme}
                        disabled={true}
                        needTitle
                        title={`total`}
                        value={stripDigitPlaces(values.total, 2) || ''}
                        onChange={this.onTotalChange}
                        symbol={pair[1]}
                      />
                    </div>
                  </InputRowContainer>
                )}

                <BlueSlider
                  theme={theme}
                  showMarks
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
                        ? stripDigitPlaces(
                            newValue / priceForCalculate,
                            isSPOTMarket ? 8 : quantityPrecision
                          )
                        : stripDigitPlaces(
                            newValue,
                            isSPOTMarket ? 8 : quantityPrecision
                          )

                    const newTotal =
                      isBuyType || !isSPOTMarket
                        ? newValue
                        : newValue * priceForCalculate

                    const newMargin = stripDigitPlaces(
                      (maxAmount * (value / 100)) / leverage,
                      2
                    )

                    setFieldValue('amount', newAmount)
                    setFieldValue(
                      'total',
                      stripDigitPlaces(newTotal, isSPOTMarket ? 8 : 3)
                    )
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
                    theme={theme}
                    needTitle
                    title={`total (${pair[1]})`}
                    value={values.total || ''}
                    onChange={this.onTotalChange}
                    symbol={pair[1]}
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
                    theme={theme}
                    needTitle
                    disabled={priceType === 'market'}
                    title={`margin (${pair[1]})`}
                    value={values.margin || ''}
                    type={'text'}
                    pattern={'[0-9]+.[0-9]{2}'}
                    onChange={this.onMarginChange}
                    symbol={pair[1]}
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
            xs={4}
            item
            container
            style={{ maxWidth: '100%', paddingBottom: '1.5rem' }}
          >
            <Grid xs={12} item container alignItems="center">
              <SendButton
                theme={theme}
                // disabled={orderIsCreating === operationType}
                type={operationType}
                onClick={async () => {
                  const result = await validateForm()
                  console.log('result', result)
                  if (Object.keys(result).length === 0 || !isSPOTMarket) {
                    handleSubmit(values)
                  }
                }}
              >
                {isSPOTMarket
                  ? operationType === 'buy'
                    ? `buy ${pair[0]}`
                    : `sell ${pair[0]}`
                  : operationType === 'buy'
                  ? 'long'
                  : 'short'}
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
      pair,
      isSPOTMarket,
      reduceOnly,
      orderMode,
      TIFMode,
      trigger,
      leverage,
      enqueueSnackbar,
      minSpotNotional,
      minFuturesStep,
    } = props

    if (values.total < minSpotNotional && isSPOTMarket) {
      enqueueSnackbar(
        `Order total should be at least ${minSpotNotional} ${pair[1]}`,
        {
          variant: 'error',
        }
      )

      return
    }

    if (values.amount < minFuturesStep && !isSPOTMarket) {
      enqueueSnackbar(
        `Order amount should be at least ${minFuturesStep} ${pair[0]}`,
        {
          variant: 'error',
        }
      )

      return
    }

    // if (values.amount % minFuturesStep !== 0 && !isSPOTMarket) {
    //   enqueueSnackbar(
    //     `Order amount should divided without remainder on ${minFuturesStep}`,
    //     {
    //       variant: 'error',
    //     }
    //   )

    //   return
    // }

    if (priceType || byType) {
      const filtredValues =
        priceType === 'limit'
          ? { limit: values.limit, price: values.price, amount: values.amount }
          : priceType === 'market'
          ? { amount: values.amount }
          : {
              stop: values.stop,
              price: values.price,
              amount: values.amount,
            }

      const successResult = {
        status: 'success',
        message: 'Order placed',
        orderId: '0',
      }

      props.showOrderResult(
        successResult,
        props.cancelOrder,
        isSPOTMarket ? 0 : 1
      )

      // await props.addLoaderToButton(byType)

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
            ? orderMode === 'TIF' && priceType !== 'stop-market'
              ? { timeInForce: TIFMode, postOnly: false }
              : orderMode === 'postOnly'
              ? { timeInForce: TIFMode, postOnly: true }
              : { postOnly: true }
            : {}),
          ...(priceType === 'stop-limit' || priceType === 'stop-market'
            ? {
                workingType:
                  trigger === 'mark price' ? 'MARK_PRICE' : 'CONTRACT_PRICE',
              }
            : {}),
          ...{ reduceOnly },
        }
      )

      if (result.status === 'error' || !result.orderId) {
        await props.showOrderResult(
          result,
          props.cancelOrder,
          isSPOTMarket ? 0 : 1
        )
      }
      // await await props.addLoaderToButton(false)
      setSubmitting(false)
    }
  },
})

export default compose(
  withErrorFallback,
  formikEnhancer
)(TraidingTerminal)
