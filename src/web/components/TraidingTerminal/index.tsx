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
  onValueClick = () => { },
  theme,
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
              theme={theme}
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
            theme={theme}
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
      {needLine && <Line theme={theme} lineMargin={lineMargin} />}
      {needRightValue && (
        <BlueInputTitle theme={theme} onClick={() => onValueClick()}>
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
  symbolRightIndent = '',
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
  onChange = () => { },
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
  symbolRightIndent?: string
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
      funds,
      leverage,
      priceType,
      marketPrice,
      isSPOTMarket,
      pricePrecision,
      quantityPrecision,
      operationType,
      marketPriceAfterPairChange,
      values: { amount, price, total, margin },
    } = this.props

    if (marketPriceAfterPairChange !== prevProps.marketPriceAfterPairChange) {
      this.onPriceChange({ target: { value: marketPriceAfterPairChange } })
    }

    if (prevProps.marketPrice === null && this.props.marketPrice !== null) {
      this.setFormatted(
        'price',
        stripDigitPlaces(
          +marketPrice,
          pricePrecision
        ),
        0
      )
    }

    if (prevProps.priceType !== priceType) {
      const priceForCalculate =
        priceType !== 'market' && priceType !== 'maker-only'
          ? price
          : marketPrice
      this.setFormatted(
        'amount',
        stripDigitPlaces(
          +total / +priceForCalculate,
          isSPOTMarket ? 8 : quantityPrecision
        ),
        0
      )
    }

    if (
      this.state.priceFromOrderbook !== this.props.priceFromOrderbook &&
      priceType !== 'market' &&
      priceType !== 'maker-only'
    ) {
      const { priceFromOrderbook, leverage } = this.props

      this.setFormatted('price', priceFromOrderbook, 1)
      this.setFormatted('stop', priceFromOrderbook, 1)
      this.setFormatted('total', amount * priceFromOrderbook, 1)
      this.setFormatted(
        'margin',
        stripDigitPlaces((amount * priceFromOrderbook) / leverage, 3),
        0
      )
      this.setState({ priceFromOrderbook })
    }

    if (leverage !== prevProps.leverage) {
      const priceForCalculate =
        priceType !== 'market' && priceType !== 'maker-only'
          ? price
          : marketPrice
      const maxTotal = funds[1].quantity * leverage

      this.setFormatted('total', stripDigitPlaces(margin * leverage, 8), 0)

      this.setFormatted(
        'amount',
        stripDigitPlaces(
          (margin * leverage) / priceForCalculate,
          isSPOTMarket ? 8 : quantityPrecision
        ),
        0
      )
    }

    if (marketPrice !== prevProps.marketPrice && priceType === 'market') {
      this.setFormatted(
        'amount',
        stripDigitPlaces(
          total / marketPrice,
          isSPOTMarket ? 8 : quantityPrecision
        ),
        0
      )
    }
  }

  setFormatted = (fild: string, value: any, index: number) => {
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

  onStopChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
    const { setFieldValue } = this.props
    setFieldValue('stop', e.target.value)
  }

  onTotalChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
    const {
      priceType,
      marketPrice,
      values: { price },
      isSPOTMarket,
      quantityPrecision,
      leverage,
      setFieldValue,
    } = this.props

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only' ? price : marketPrice

    setFieldValue('total', e.target.value)

    if (priceForCalculate) {
      const amount = e.target.value / priceForCalculate
      const margin = e.target.value / leverage

      setFieldValue(
        'amount',
        stripDigitPlaces(amount, quantityPrecision)
      )

      setFieldValue('margin', stripDigitPlaces(margin, 3))
    }
  }

  onAmountChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
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

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only' ? price : marketPrice
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
      ? stripDigitPlaces(amountForUpdate, quantityPrecision)
      : e.target.value

    setFieldValue('amount', strippedAmount)
    setFieldValue('margin', stripDigitPlaces(newMargin, 3))
    setFieldValue('total', stripDigitPlaces(total, 3))
  }

  onPriceChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
    const {
      values: { limit, amount },
      setFieldTouched,
      marketPrice,
      priceType,
      leverage,
      setFieldValue,
    } = this.props

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only'
        ? e.target.value
        : marketPrice

    setFieldValue('price', e.target.value)

    const total = stripDigitPlaces(e.target.value * amount, 3)
    this.setFormatted('total', total, 1)

    const newMargin = stripDigitPlaces(
      (amount / leverage) * priceForCalculate,
      2
    )

    this.setFormatted('margin', newMargin, 1)
  }

  onMarginChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
    const {
      values: { price },
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

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only' ? price : marketPrice

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
      priceType !== 'market' &&
        priceType !== 'maker-only' &&
        values.limit !== null
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

    console.log('((values.total / priceForCalculate) / maxAmount) * 100', ((values.total / priceForCalculate) / maxAmount) * 100)

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={`${pair[0]}/${pair[1]}`}>
          <Grid item container xs={8} style={{ maxWidth: '100%' }}>
            <InputRowContainer
              direction="column"
              style={{ margin: 'auto 0', width: '100%' }}
            >
              {priceType !== 'market' &&
                priceType !== 'stop-market' &&
                priceType !== 'maker-only' ? (
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
                    title={`${isSPOTMarket ? 'amount' : 'order quantity'} (${pair[0]
                      })`}
                    value={values.amount}
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
                          value={values.amount}
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
                          //disabled={false}
                          needTitle
                          title={`total`}
                          type={'text'}
                          value={values.total === '' ? '' : values.total}
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
                      ? ((values.total) / maxAmount) * 100
                      : values.amount / (maxAmount / 100)
                  }
                  sliderContainerStyles={{
                    width: 'calc(100% - 1rem)',
                    margin: '0 .5rem',
                    padding: '.9rem 0 0 0',
                  }}
                  onChange={(value) => {
                    console.log('value in amount slider', value)
                    const newValue = (maxAmount / 100) * value

                    const newAmount =
                      isBuyType || !isSPOTMarket
                        ? stripDigitPlaces(
                          newValue / priceForCalculate,
                          quantityPrecision
                        )
                        : stripDigitPlaces(
                          newValue,
                          quantityPrecision
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
                      stripDigitPlaces(newTotal, 3)
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
                    type={'text'}
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
                  <TradeInputContent
                    theme={theme}
                    needTitle
                    //disabled={priceType === 'market'}
                    title={`margin (${pair[1]})`}
                    value={values.margin || ''}
                    type={'text'}
                    pattern={'[0-9]+.[0-9]{2}'}
                    onChange={this.onMarginChange}
                    symbol={pair[1]}
                  />
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
      : priceType === 'market' || priceType === 'maker-only'
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
          ...(priceType !== 'market' && priceType !== 'maker-only'
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
