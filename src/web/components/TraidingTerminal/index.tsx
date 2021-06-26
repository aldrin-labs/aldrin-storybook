import React, { PureComponent, SyntheticEvent, CSSProperties } from 'react'

import { compose } from 'recompose'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'
import { withSnackbar } from 'notistack'
import { withFormik, validateYupSchema, yupToFormErrors } from 'formik'

import { Grid, InputAdornment, Typography, Theme } from '@material-ui/core'
import { Loading } from '@sb/components/index'
import { ConfirmationPopup } from './ConfirmationPopup'

import { isEqual, stubFalse, toNumber, toPairs } from 'lodash-es'
import { traidingErrorMessages } from '@core/config/errorMessages'
import { IProps, FormValues, IPropsWithFormik, priceType } from './types'
import Info from '@icons/inform.svg'
import SvgIcon from '@sb/components/SvgIcon'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import BlueSlider from '@sb/components/Slider/BlueSlider'
import { notify } from '@sb/dexUtils/notifications'

import {
  Container,
  GridContainer,
  Coin,
  UpdatedCoin,
  InputTitle,
  InputWrapper,
  TradeInputBlock,
  TitleForInput,
  TradeInput,
  BlueInputTitle,
  SeparateInputTitle,
  AbsoluteInputTitle,
  Placeholder,
} from './styles'
import { SendButton } from '../TraidingTerminal/styles'
import {
  Line,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import {
  InputRowContainer,
  AdditionalSettingsButton,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { ButtonsWithAmountFieldRowForBasic } from './AmountButtons'
import ConnectWalletDropdown from '../ConnectWalletDropdown/index'
import { validateVariablesForPlacingOrder } from '@sb/dexUtils/send'

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
              // style={{
              //   borderBottom: haveTooltip ? '.1rem solid #e0e5ec' : 'none',
              // }}
            >
              {title}
            </SeparateInputTitle>
          </DarkTooltip>
          {/* </TooltipContainer> */}
        </>
      ) : (
        <SeparateInputTitle
          theme={theme}
          // style={{
          //   borderBottom: haveTooltip ? '.1rem solid #e0e5ec' : 'none',
          // }}
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
  min = 0,
  type = 'number',
  padding = '0',
  width = '100%',
  fontSize = '',
  textAlign = 'right',
  onChange = () => {},
  inputStyles,
  header = '',
  theme,
  needTooltip = false,
  textDecoration,
  titleForTooltip = '',
  needTitleBlock = false,
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
  min?: number
  type?: string
  padding?: string | number
  width?: string | number
  fontSize?: string
  textAlign?: string
  onChange: any
  header?: any
  inputStyles?: CSSProperties
  theme?: Theme
  textDecoration?: string
  needTooltip?: boolean
  titleForTooltip?: string
  needTitleBlock?: boolean
}) => {
  return (
    <InputRowContainer
      padding={padding}
      width={width}
      style={{ position: 'relative' }}
    >
      {needTitle && (
        <AbsoluteInputTitle style={{ ...(fontSize ? { fontSize } : {}) }}>
          {title}
        </AbsoluteInputTitle>
      )}
      {needPreSymbol ? (
        <UpdatedCoin style={{ width: 0 }} left={'2rem'}>
          {preSymbol}
        </UpdatedCoin>
      ) : null}
      {needTitleBlock ? (
        <>
          {needTooltip ? (
            <DarkTooltip title={titleForTooltip}>
              <TitleForInput theme={theme} textDecoration={textDecoration}>
                {header}
              </TitleForInput>
            </DarkTooltip>
          ) : (
            <TitleForInput theme={theme} textDecoration={textDecoration}>
              {header}
            </TitleForInput>
          )}
        </>
      ) : null}

      <TradeInput
        theme={theme}
        align={textAlign}
        type={type}
        pattern={pattern}
        step={step}
        min={min}
        isValid={showErrors ? isValid : true}
        value={value}
        symbolLength={symbol.length}
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
class TradingTerminal extends PureComponent<IPropsWithFormik> {
  state = {
    marketPrice: null,
    priceFromOrderbook: null,
    isConfirmationPopupOpen: false,
  }

  componentDidUpdate(prevProps) {
    const {
      funds,
      priceType,
      marketPrice,
      pricePrecision,
      quantityPrecision,
      sideType,
      marketPriceAfterPairChange,
      values: { amount, price, total },
      setFieldValue,
    } = this.props

    // Handling case with balances in TradingTerminal
    const isBuyType = sideType === 'buy'
    const fundsAssetValue = isBuyType ? funds[1].quantity : funds[0].quantity
    const previousFundsAssetValue = isBuyType
      ? prevProps.funds[1].quantity
      : prevProps.funds[0].quantity

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

    // if (
    //   fundsAssetValue !== previousFundsAssetValue &&
    //   fundsAssetValue &&
    //   priceForCalculate
    // ) {
    //   const newValue = fundsAssetValue

    //   const newAmount = isBuyType
    //     ? +stripDigitPlaces(newValue / priceForCalculate, quantityPrecision)
    //     : +stripDigitPlaces(newValue, quantityPrecision)

    //   const newTotal = newAmount * priceForCalculate

    //   setFieldValue('amount', newAmount)
    //   setFieldValue('total', stripDigitPlaces(newTotal, 2))
    // }

    if (marketPriceAfterPairChange !== prevProps.marketPriceAfterPairChange) {
      this.onPriceChange({
        target: {
          value: +stripDigitPlaces(marketPriceAfterPairChange, pricePrecision),
        },
      })
    }

    if (
      (prevProps.marketPrice === null && this.props.marketPrice !== null) ||
      prevProps.pricePrecision !== this.props.pricePrecision
    ) {
      this.setFormatted(
        'price',
        stripDigitPlaces(+marketPrice, pricePrecision),
        0
      )
    }

    if (prevProps.priceType !== priceType) {
      this.setFormatted(
        'total',
        stripDigitPlaces(amount * priceForCalculate, 2),
        0
      )
    }

    if (
      this.state.priceFromOrderbook !== this.props.priceFromOrderbook &&
      priceType !== 'market'
    ) {
      const { priceFromOrderbook, leverage } = this.props

      this.setFormatted(
        'price',
        stripDigitPlaces(priceFromOrderbook, pricePrecision),
        0
      )
      this.setFormatted('stop', priceFromOrderbook, 1)
      this.setFormatted(
        'total',
        stripDigitPlaces(amount * priceFromOrderbook, 3),
        0
      )
      this.setState({ priceFromOrderbook })
    }

    if (marketPrice !== prevProps.marketPrice && priceType === 'market') {
      this.setFormatted('total', stripDigitPlaces(marketPrice * amount, 2), 0)
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

    if (`${e.target.value}`.match(/[a-zA-Z]/)) {
      return
    }

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only' ? price : marketPrice

    setFieldValue('total', e.target.value)

    if (priceForCalculate) {
      const amount = e.target.value / priceForCalculate

      setFieldValue('amount', stripDigitPlaces(amount, quantityPrecision))
    }
  }

  onAmountChange = (
    e: SyntheticEvent<Element> | { target: { value: number } }
  ) => {
    const {
      funds,
      priceType,
      sideType,
      isSPOTMarket,
      leverage,
      minOrderSize,
      marketPrice,
      setFieldValue,
      values: { price, limit },
      setFieldTouched,
      quantityPrecision,
    } = this.props

    if (`${e.target.value}`.match(/[a-zA-Z]/)) {
      return
    }

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only' ? price : marketPrice
    const isBuyType = sideType === 'buy'

    let maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity

    const currentMaxAmount =
      isBuyType || !isSPOTMarket ? maxAmount / priceForCalculate : maxAmount

    const isAmountMoreThanMax = e.target.value > currentMaxAmount
    const isAmountLessThanMin =
      stripDigitPlaces(e.target.value, quantityPrecision) < minOrderSize &&
      stripDigitPlaces(e.target.value, quantityPrecision) !== '' &&
      stripDigitPlaces(e.target.value, quantityPrecision) !== '0'

    const amountForUpdate = isAmountMoreThanMax
      ? currentMaxAmount
      : isAmountLessThanMin && minOrderSize < 1
      ? minOrderSize
      : e.target.value

    const total = amountForUpdate * priceForCalculate

    const strippedAmount = isAmountMoreThanMax
      ? stripDigitPlaces(amountForUpdate, quantityPrecision)
      : isAmountLessThanMin
      ? amountForUpdate
      : e.target.value

    setFieldValue('amount', strippedAmount)
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

    if (`${e.target.value}`.match(/[a-zA-Z]/)) {
      return
    }

    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only'
        ? e.target.value
        : marketPrice

    setFieldValue('price', e.target.value)

    const total = stripDigitPlaces(e.target.value * amount, 3)
    this.setFormatted('total', total, 1)
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

    setFieldValue('amount', stripDigitPlaces(newAmount, quantityPrecision))
    setFieldValue('total', stripDigitPlaces(newTotal, 2))
  }

  openConfirmationPopup = () => {
    this.setState({ isConfirmationPopupOpen: true })
  }

  closeConfirmationPopup = () => {
    this.setState({ isConfirmationPopupOpen: false })
  }

  render() {
    const {
      pair,
      theme,
      marketPrice,
      funds,
      leverage,
      sideType,
      priceType,
      isSPOTMarket,
      values,
      handleSubmit,
      validateForm,
      setFieldValue,
      lockedAmount,
      quantityPrecision,
      orderIsCreating,
      takeProfit,
      takeProfitPercentage,
      breakEvenPoint,
      updateState,
      tradingBotEnabled,
      tradingBotInterval,
      tradingBotIsActive,
      minOrderSize,
      connected,
      SOLAmount,
      spread,
      openOrdersAccount,
      market,
      wallet,
    } = this.props

    const costsOfTheFirstTrade = 0.024
    const SOLFeeForTrade = 0.00001
    const needCreateOpenOrdersAccount = !openOrdersAccount

    if (!funds) return null

    const isBuyType = sideType === 'buy'

    const priceForCalculate =
      priceType !== 'market' &&
      priceType !== 'maker-only' &&
      values.limit !== null
        ? values.price
        : marketPrice

    let maxAmount = 0

    if (isSPOTMarket) {
      maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity
      if (tradingBotEnabled && maxAmount > 50) {
        maxAmount = 50
      }
    } else if (this.props.reduceOnly) {
      maxAmount = lockedAmount * priceForCalculate
    } else {
      maxAmount = funds[1].quantity * leverage
    }

    return (
      <Container background={'transparent'}>
        <GridContainer isBuyType={isBuyType} key={`${pair[0]}/${pair[1]}`}>
          <Grid item container xs={9} style={{ maxWidth: '100%' }}>
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
                    title={`price`}
                    value={values.price || ''}
                    onChange={this.onPriceChange}
                    symbol={pair[1]}
                  />
                </InputRowContainer>
              ) : null}
              {priceType === 'market' && !tradingBotEnabled && (
                <InputRowContainer
                  style={{ visibility: !isBuyType ? 'hidden' : 'visible' }}
                ></InputRowContainer>
              )}
              {tradingBotEnabled && !tradingBotIsActive && (
                <FormInputContainer
                  theme={theme}
                  haveTooltip={false}
                  tooltipText={
                    <>
                      <p>Waiting after unrealized P&L will reach set target.</p>
                      <p>
                        <b>For example:</b> you set 10% stop loss and 1 minute
                        timeout. When your unrealized loss is 10% timeout will
                        give a minute for a chance to reverse trend and loss to
                        go below 10% before stop loss order executes.
                      </p>
                    </>
                  }
                  title={'Buy SRM Each'}
                  lineMargin={'0 1.2rem 0 1rem'}
                  style={{
                    borderBottom: theme.palette.border.main,
                    padding: '1rem 0',
                  }}
                >
                  <InputRowContainer>
                    <TradeInputContent
                      theme={theme}
                      haveSelector
                      symbol={'sec'}
                      width={'calc(50% - .4rem)'}
                      value={tradingBotInterval}
                      onChange={(e) => {
                        if (+e.target.value > 600) {
                          updateState('tradingBotInterval', 600)
                        } else {
                          updateState('tradingBotInterval', e.target.value)
                        }
                      }}
                      inputStyles={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    />
                    <BlueSlider
                      theme={theme}
                      showMarks={false}
                      value={tradingBotInterval}
                      valueSymbol={'sec'}
                      min={45}
                      max={600}
                      sliderContainerStyles={{
                        width: 'calc(50% - 1.5rem)',
                        margin: '0 .5rem 0 1rem',
                      }}
                      onChange={(value) => {
                        updateState('tradingBotInterval', value)
                      }}
                    />
                  </InputRowContainer>
                </FormInputContainer>
              )}
              <ButtonsWithAmountFieldRowForBasic
                {...{
                  pair,
                  needButtons: true,
                  theme,
                  maxAmount,
                  minOrderSize,
                  priceType,
                  onAmountChange: this.onAmountChange,
                  onTotalChange: this.onTotalChange,
                  isSPOTMarket,
                  quantityPrecision,
                  priceForCalculate,
                  amount: values.amount,
                  total: values.total,
                  leverage,
                  isBuyType,
                  onAfterSliderChange: (value) => {
                    if (!priceForCalculate) {
                      return
                    }

                    const newValue = (maxAmount / 100) * value

                    const newAmount = isBuyType
                      ? +stripDigitPlaces(
                          newValue / priceForCalculate,
                          quantityPrecision,
                          market?.minOrderSize
                        )
                      : +stripDigitPlaces(
                          newValue,
                          quantityPrecision,
                          market?.minOrderSize
                        )

                    const newTotal = newAmount * priceForCalculate

                    setFieldValue('amount', newAmount)
                    setFieldValue('total', stripDigitPlaces(newTotal, 2))
                  },
                }}
              />{' '}
              {takeProfit && !tradingBotEnabled && priceType === 'market' && (
                <InputRowContainer>
                  <TradeInputContent
                    theme={theme}
                    padding={'0 1.5% 0 0'}
                    width={'calc(50%)'}
                    symbol={'%'}
                    title={'Take Profit'}
                    textAlign={'right'}
                    needTitle={true}
                    value={takeProfitPercentage}
                    onChange={(e) => {
                      updateState('takeProfitPercentage', e.target.value)
                    }}
                  />

                  <BlueSlider
                    theme={theme}
                    value={takeProfitPercentage * 20}
                    sliderContainerStyles={{
                      width: '50%',
                      margin: '0 0 0 1.5%',
                    }}
                    onChange={(value) => {
                      updateState('takeProfitPercentage', value / 20)
                    }}
                  />
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
              {!connected ? (
                <ConnectWalletDropdown
                  theme={theme}
                  height={'4rem'}
                  id={`${sideType}-connectButton`}
                />
              ) : (needCreateOpenOrdersAccount &&
                  SOLAmount < costsOfTheFirstTrade) ||
                SOLAmount < SOLFeeForTrade ? (
                needCreateOpenOrdersAccount ? (
                  <DarkTooltip
                    title={
                      <>
                        <p>
                          Deposit some SOL to your wallet for successful
                          trading.
                        </p>
                        <p>
                          Due to Serum design there is need to open a trading
                          account for this pair to trade it.
                        </p>
                        <p>
                          So, the “first trade” fee is{' '}
                          <span style={{ color: '#BFEAB6' }}>
                            {' '}
                            ≈{costsOfTheFirstTrade} SOL
                          </span>
                          .
                        </p>
                        <p>
                          The fee for all further trades on this pair will be
                          <span style={{ color: '#BFEAB6' }}>
                            {' '}
                            ≈{SOLFeeForTrade} SOL
                          </span>
                          .{' '}
                        </p>
                      </>
                    }
                  >
                    <Placeholder>
                      Insufficient SOL balance to complete the transaction.
                      <SvgIcon src={Info} width={'5%'} />
                    </Placeholder>
                  </DarkTooltip>
                ) : (
                  <DarkTooltip
                    title={
                      <>
                        <p>
                          Deposit some SOL to your wallet for successful
                          trading.
                        </p>
                        <p>
                          The fee size for each trade on the DEX is{' '}
                          <span style={{ color: '#BFEAB6' }}>
                            {' '}
                            ≈0.00001 SOL
                          </span>
                          .{' '}
                        </p>
                      </>
                    }
                  >
                    <Placeholder>
                      Insufficient SOL balance to complete the transaction.
                      <SvgIcon src={Info} width={'5%'} />
                    </Placeholder>
                  </DarkTooltip>
                )
              ) : (
                <SendButton
                  theme={theme}
                  style={{
                    ...(tradingBotEnabled && !tradingBotIsActive
                      ? { position: 'absolute', width: '95%' }
                      : {}),
                  }}
                  type={sideType}
                  onClick={() => {
                    const isValidationSuccessfull = validateVariablesForPlacingOrder(
                      {
                        price: values.price,
                        size: values.amount,
                        market,
                        wallet,
                      }
                    )

                    if (!isValidationSuccessfull) {
                      return
                    }

                    this.openConfirmationPopup()
                  }}
                >
                  {isSPOTMarket
                    ? sideType === 'buy'
                      ? priceType === 'market' && pair.join('_') === 'SRM_USDT'
                        ? tradingBotEnabled && !tradingBotIsActive
                          ? 'Start Cycle Bot'
                          : 'buy SRM'
                        : `buy ${pair[0]}`
                      : `sell ${pair[0]}`
                    : sideType === 'buy'
                    ? 'long'
                    : 'short'}
                </SendButton>
              )}
              <ConfirmationPopup
                theme={theme}
                spread={spread}
                open={this.state.isConfirmationPopupOpen}
                pair={pair}
                maxAmount={maxAmount}
                minOrderSize={minOrderSize}
                priceType={priceType}
                onAmountChange={this.onAmountChange}
                onTotalChange={this.onTotalChange}
                isSPOTMarket={isSPOTMarket}
                quantityPrecision={quantityPrecision}
                priceForCalculate={priceForCalculate}
                amount={values.amount}
                total={values.total}
                leverage={leverage}
                isBuyType={isBuyType}
                onPriceChange={this.onPriceChange}
                values={values}
                sideType={sideType}
                onClose={this.closeConfirmationPopup}
                costsOfTheFirstTrade={costsOfTheFirstTrade}
                SOLFeeForTrade={SOLFeeForTrade}
                needCreateOpenOrdersAccount={needCreateOpenOrdersAccount}
                validateForm={validateForm}
                handleSubmit={handleSubmit}
              />
            </Grid>
          </Grid>
        </GridContainer>
      </Container>
    )
  }
}

const formikEnhancer = withFormik<IProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      price: stripDigitPlaces(props.marketPrice, props.pricePrecision),
      stop: 0,
      limit: stripDigitPlaces(props.marketPrice, props.pricePrecision),
      amount: 0,
      total: 0,
    }
  },
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
      takeProfit,
      takeProfitPercentage,
      breakEvenPoint,
      tradingBotEnabled,
      tradingBotInterval,
      tradingBotTotalTime,
      updateState,
      publicKey,
    } = props

    // if (values.total < minSpotNotional && isSPOTMarket) {
    //   enqueueSnackbar(
    //     `Order total should be at least ${minSpotNotional} ${pair[1]}`,
    //     {
    //       variant: 'error',
    //     }
    //   )

    //   return
    // }

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

    if (publicKey === '') {
      notify({
        type: 'error',
        message: 'Connect wallet first',
      })

      return
    }

    if (values.amount === 0 || values.amount === '') {
      notify({
        type: 'error',
        message: 'Your amount is 0',
      })

      return
    }

    if (priceType || byType) {
      const filtredValues =
        priceType === 'limit'
          ? {
              limit: values.limit,
              price: values.price,
              amount: values.amount,
            }
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

      // props.showOrderResult(
      //   successResult,
      //   props.cancelOrder,
      //   isSPOTMarket ? 0 : 1
      // )

      // await props.addLoaderToButton(byType)
      if (tradingBotEnabled) {
        updateState('tradingBotIsActive', true)
      }

      const result = await props.confirmOperation(
        byType,
        priceType,
        filtredValues,
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
          orderMode,
          takeProfit,
          takeProfitPercentage,
          breakEvenPoint,
          tradingBotEnabled,
          tradingBotInterval,
          tradingBotTotalTime,
        }
      )

      // if (result.status === 'error' || !result.orderId) {
      //   await props.showOrderResult(
      //     result,
      //     props.cancelOrder,
      //     isSPOTMarket ? 0 : 1
      //   )
      // }
      // await await props.addLoaderToButton(false)
      setSubmitting(false)
    }
  },
})

export default compose(withErrorFallback, formikEnhancer)(TradingTerminal)
