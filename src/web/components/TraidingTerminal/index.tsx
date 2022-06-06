import { Grid, Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import { withFormik } from 'formik'
import { toNumber } from 'lodash-es'
import React, { CSSProperties, PureComponent, SyntheticEvent } from 'react'
import { compose } from 'recompose'

import { Line } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { MobileWalletDropdown } from '@sb/compositions/Chart/components/MobileNavbar/MobileWalletDropdown'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import {
  InputRowContainer,
  InputsBlock,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { notify } from '@sb/dexUtils/notifications'
import { validateVariablesForPlacingOrder } from '@sb/dexUtils/send'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { formatNumberWithSpaces } from '../../dexUtils/utils'
import { Button } from '../Button'
import { INPUT_FORMATTERS } from '../Input'
import CustomSwitcher from '../SwitchOnOff/CustomSwitcher'
import { ButtonsWithAmountFieldRowForBasic } from './AmountButtons'
import { ConfirmationPopup } from './ConfirmationPopup'
import { InsufficientBalancePlaceholder } from './InsufficientBalancePlaceholder'
import {
  AbsoluteInputTitle,
  BlueInputTitle,
  ButtonBlock,
  ConnectWalletButtonContainer,
  ConnectWalletDropdownContainer,
  Container,
  SeparateInputTitle,
  SwitchersContainer,
  TerminalGridContainer,
  TitleForInput,
  TradeInput,
  UpdatedCoin,
} from './styles'
import { FormValues, IProps, IPropsWithFormik } from './types'
import {
  costOfAddingToken,
  costsOfTheFirstTrade,
  costsOfWrappingSOL,
  SOLFeeForTrade,
} from './utils'

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
            maxWidth="30rem"
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
  needTooltip = false,
  textDecoration,
  titleForTooltip = '',
  needTitleBlock = false,
  onTitleClick,
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
  onTitleClick?: any
}) => {
  const handleSelect = (e) => {
    e.target.select()
  }

  const changeHandler = (e) => {
    const { value: newValue } = e.target
    onChange({ target: { value: INPUT_FORMATTERS.DECIMAL(newValue, value) } })
  }

  return (
    <InputRowContainer
      padding={padding}
      width={width}
      style={{ position: 'relative' }}
    >
      {needTitle && (
        <AbsoluteInputTitle
          onClick={() => onTitleClick()}
          style={{ ...(fontSize ? { fontSize } : {}) }}
        >
          {title}
        </AbsoluteInputTitle>
      )}
      {needPreSymbol ? (
        <UpdatedCoin style={{ width: 0 }} left="2rem">
          {preSymbol}
        </UpdatedCoin>
      ) : null}
      {needTitleBlock ? (
        <>
          {needTooltip ? (
            <DarkTooltip title={titleForTooltip}>
              <TitleForInput textDecoration={textDecoration}>
                {header}
              </TitleForInput>
            </DarkTooltip>
          ) : (
            <TitleForInput textDecoration={textDecoration}>
              {header}
            </TitleForInput>
          )}
        </>
      ) : null}

      <TradeInput
        align={textAlign}
        type={type}
        pattern={pattern}
        step={step}
        min={min}
        isValid={showErrors ? isValid : true}
        value={value}
        symbolLength={symbol.length}
        disabled={disabled}
        onChange={changeHandler}
        needPadding={symbol !== ''}
        haveSelector={haveSelector}
        style={{ ...inputStyles, ...(fontSize ? { fontSize } : {}) }}
        onClick={(e) => handleSelect(e)}
      />
      <UpdatedCoin
        right={symbolRightIndent || (symbol.length <= 2 ? '2.5rem' : '1rem')}
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
    isWalletPopupOpen: false,
    isConnectWalletPopupOpen: false,
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
      updateWrapperState,
    } = this.props

    const isBuyType = sideType === 'buy'

    const priceForCalculate = priceType !== 'market' ? price : marketPrice

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

    if (this.state.priceFromOrderbook !== this.props.priceFromOrderbook) {
      const { priceFromOrderbook } = this.props

      updateWrapperState({
        mode: 'limit',
        orderMode: 'TIF',
        tradingBotEnabled: false,
        TVAlertsBotEnabled: false,
      })

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

    const maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity

    const currentMaxAmount =
      isBuyType || !isSPOTMarket ? maxAmount / priceForCalculate : maxAmount

    // const isAmountMoreThanMax = e.target.value > currentMaxAmount
    const isAmountMoreThanMax = false
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
      updateWrapperState,
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
      setAutoConnect,
      providerUrl,
      setProvider,
      baseCurrencyAccount,
      quoteCurrencyAccount,
      isButtonLoaderShowing,
      newTheme,
    } = this.props

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

    const onSendOrder = ({ values, market, wallet }) => {
      const isValidationSuccessfull = validateVariablesForPlacingOrder({
        price: values.price,
        size: values.amount,
        market,
        wallet,
      })

      if (!isValidationSuccessfull) {
        return
      }

      this.openConfirmationPopup()
    }

    return (
      <Container background="transparent">
        <TerminalGridContainer
          isBuyType={isBuyType}
          key={`${pair[0]}/${pair[1]}`}
        >
          <SwitchersContainer>
            <CustomSwitcher
              theme={theme}
              firstHalfText="buy"
              secondHalfText="sell"
              buttonHeight="3rem"
              needBorderRadius
              needBorder={false}
              containerStyles={{
                width: '100%',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-around',
                height: '6rem',
                background: newTheme.colors.gray5,
                borderRadius: '2rem',
                alignItems: 'center',
              }}
              firstHalfStyleProperties={{
                activeColor: newTheme.colors.green7,
                activeBackgroundColor: newTheme.colors.gray10,
                borderRadius: '3rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              secondHalfStyleProperties={{
                activeColor: newTheme.colors.red4,
                activeBackgroundColor: newTheme.colors.gray10,
                borderRadius: '3rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              firstHalfIsActive={sideType === 'buy'}
              changeHalf={() => {
                if (isBuyType) {
                  updateWrapperState({ side: 'sell' })
                } else {
                  updateWrapperState({ side: 'buy' })
                }
              }}
            />
            <CustomSwitcher
              theme={theme}
              firstHalfText="market"
              secondHalfText="limit"
              buttonHeight="3rem"
              needBorderRadius
              needBorder={false}
              containerStyles={{
                width: '100%',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-around',
                height: '6rem',
                background: newTheme.colors.gray5,
                borderRadius: '2rem',
                alignItems: 'center',
                marginTop: '2rem',
              }}
              firstHalfStyleProperties={{
                activeColor: newTheme.colors.gray0,
                activeBackgroundColor: newTheme.colors.gray10,
                borderRadius: '4rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              secondHalfStyleProperties={{
                activeColor: newTheme.colors.gray0,
                activeBackgroundColor: newTheme.colors.gray10,
                borderRadius: '4rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              firstHalfIsActive={priceType === 'market'}
              changeHalf={() => {
                if (priceType === 'market') {
                  updateWrapperState({
                    mode: 'limit',
                    orderMode: 'TIF',
                    tradingBotEnabled: false,
                    TVAlertsBotEnabled: false,
                  })
                } else {
                  updateWrapperState({
                    mode: 'market',
                    orderMode: 'ioc',
                    TVAlertsBotEnabled: false,
                  })
                }
              }}
            />
          </SwitchersContainer>
          <Grid item container xs={9} style={{ maxWidth: '100%' }}>
            <InputsBlock direction="column">
              {priceType !== 'market' &&
              priceType !== 'stop-market' &&
              priceType !== 'maker-only' ? (
                <InputRowContainer
                  key="limit-price"
                  padding=".6rem 0"
                  direction="column"
                >
                  <TradeInputContent
                    theme={theme}
                    needTitle
                    type="text"
                    title="price"
                    value={formatNumberWithSpaces(values.price || '')}
                    onChange={this.onPriceChange}
                    symbol={pair[1]}
                  />
                </InputRowContainer>
              ) : null}
              {/* {priceType === 'market' && !tradingBotEnabled && (
                <InputRowContainer
                  style={{ visibility: !isBuyType ? 'hidden' : 'visible' }}
                ></InputRowContainer>
              )} */}
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
                  title="Buy SRM Each"
                  lineMargin="0 1.2rem 0 1rem"
                  style={{
                    borderBottom: theme.palette.border.main,
                    padding: '1rem 0',
                  }}
                >
                  <InputRowContainer>
                    <TradeInputContent
                      theme={theme}
                      haveSelector
                      symbol="sec"
                      width="calc(50% - .4rem)"
                      value={tradingBotInterval}
                      onChange={(e) => {
                        if (+e.target.value > 600) {
                          updateWrapperState({ tradingBotInterval: 600 })
                        } else {
                          updateWrapperState({
                            tradingBotInterval: e.target.value,
                          })
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
                      valueSymbol="sec"
                      min={45}
                      max={600}
                      sliderContainerStyles={{
                        width: 'calc(50% - 1.5rem)',
                        margin: '0 .5rem 0 1rem',
                      }}
                      onChange={(value) => {
                        updateWrapperState({ tradingBotInterval: value })
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

                    const newValue = maxAmount * (value / 100)

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
              />
              {takeProfit && !tradingBotEnabled && priceType === 'market' && (
                <InputRowContainer>
                  <TradeInputContent
                    theme={theme}
                    padding="0 1.5% 0 0"
                    width="calc(50%)"
                    symbol="%"
                    title="Take Profit"
                    textAlign="right"
                    needTitle
                    value={takeProfitPercentage}
                    onChange={(e) => {
                      updateWrapperState({
                        takeProfitPercentage: e.target.value,
                      })
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
                      updateWrapperState({ takeProfitPercentage: value / 20 })
                    }}
                  />
                </InputRowContainer>
              )}
            </InputsBlock>
          </Grid>
          <ButtonBlock xs={3} item container>
            <Grid xs={12} item container alignItems="center">
              {!connected ? (
                <>
                  <ConnectWalletDropdownContainer>
                    <Button
                      $variant="primary"
                      $width="xl"
                      $padding="lg"
                      $fontSize="lg"
                      onClick={() => {
                        this.setState({
                          isConnectWalletPopupOpen: true,
                        })
                      }}
                    >
                      Connect wallet
                    </Button>
                  </ConnectWalletDropdownContainer>
                  <ConnectWalletButtonContainer>
                    <Button
                      $variant="primary"
                      $width="xl"
                      $padding="lg"
                      $fontSize="lg"
                      onClick={() => this.setState({ isWalletPopupOpen: true })}
                    >
                      Connect wallet
                    </Button>
                  </ConnectWalletButtonContainer>
                </>
              ) : (
                <InsufficientBalancePlaceholder
                  pair={pair}
                  SOLAmount={SOLAmount}
                  sideType={sideType}
                  theme={theme}
                  isLoading={isButtonLoaderShowing}
                  onClick={() => {
                    onSendOrder({ values, market, wallet })
                  }}
                />
              )}
              <MobileWalletDropdown
                theme={theme}
                open={this.state.isWalletPopupOpen}
                onClose={() => this.setState({ isWalletPopupOpen: false })}
                setAutoConnect={setAutoConnect}
                providerUrl={providerUrl}
                setProvider={setProvider}
              />
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
                setIsButtonLoaderShowing={(value) =>
                  this.setState({ isLoading: value })
                }
              />
            </Grid>
          </ButtonBlock>
        </TerminalGridContainer>
        <ConnectWalletPopup
          theme={theme}
          open={this.state.isConnectWalletPopupOpen}
          onClose={() => this.setState({ isConnectWalletPopupOpen: false })}
        />
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
      marketPrice,
      setFieldValue,
      enqueueSnackbar,
      minSpotNotional,
      minFuturesStep,
      takeProfit,
      takeProfitPercentage,
      breakEvenPoint,
      tradingBotEnabled,
      tradingBotInterval,
      tradingBotTotalTime,
      updateWrapperState,
      publicKey,
      sideType,
      lockedAmount,
      funds,
      isQuoteCoinExistsInWallet,
      isBaseCoinExistsInWallet,
      openOrdersAccount,
      SOLAmount,
    } = props

    const isBuyType = sideType === 'buy'
    const priceForCalculate =
      priceType !== 'market' && priceType !== 'maker-only'
        ? values.price
        : marketPrice

    // if (values.total < minSpotNotional && isSPOTMarket) {
    //   enqueueSnackbar(
    //     `Order total should be at least ${minSpotNotional} ${pair[1]}`,
    //     {
    //       variant: 'error',
    //     }
    //   )

    //   return
    // }
    const maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity

    const needCreateOpenOrdersAccount = !openOrdersAccount

    const needToAddToken =
      !isBaseCoinExistsInWallet || !isQuoteCoinExistsInWallet

    if (values.amount < minFuturesStep && !isSPOTMarket) {
      enqueueSnackbar(
        `Order amount should be at least ${minFuturesStep} ${pair[0]}`,
        {
          variant: 'error',
        }
      )

      return
    }

    let minSOlAmountForTransaction = 0

    if (isBuyType && pair[1] === 'SOL') {
      minSOlAmountForTransaction +=
        costsOfWrappingSOL + costOfAddingToken + values.total
    } else if (!isBuyType && pair[0] === 'SOL') {
      minSOlAmountForTransaction +=
        costsOfWrappingSOL + costOfAddingToken + values.amount
    }

    if (needToAddToken) {
      minSOlAmountForTransaction += costOfAddingToken
    }

    if (needCreateOpenOrdersAccount) {
      minSOlAmountForTransaction += costsOfTheFirstTrade
    }

    if (SOLAmount < minSOlAmountForTransaction) {
      enqueueSnackbar(`Insufficient SOL balance to complete the transaction.`, {
        variant: 'error',
      })
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

    const currentMaxAmount =
      isBuyType || !isSPOTMarket ? maxAmount / priceForCalculate : maxAmount

    if (values.amount > currentMaxAmount) {
      notify({
        type: 'error',
        message: 'Order amount is higher than your available balance.',
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
        updateWrapperState('tradingBotIsActive', true)
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
