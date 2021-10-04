import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Grid } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'
import { MobileWalletDropdown } from '@sb/compositions/Chart/components/MobileNavbar/MobileWalletDropdown'
import {
  InputRowContainer,
  InputsBlock
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { notify } from '@sb/dexUtils/notifications'
import { validateVariablesForPlacingOrder } from '@sb/dexUtils/send'
import { withFormik } from 'formik'
import { toNumber } from 'lodash-es'
import React, { PureComponent, SyntheticEvent } from 'react'
import { compose } from 'recompose'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import ConnectWalletDropdown from '../ConnectWalletDropdown/index'
import CustomSwitcher from '../SwitchOnOff/CustomSwitcher'
import { ButtonsWithAmountFieldRowForBasic } from './AmountButtons'
import { ConfirmationPopup } from './ConfirmationPopup'
import { InsufficientBalancePlaceholder } from './InsufficientBalancePlaceholder'
import {
  ButtonBlock, ConnectWalletButtonContainer,
  ConnectWalletDropdownContainer, Container,
  SwitchersContainer,
  TerminalGridContainer
} from './styles'
import { DecimalInput, TradeInputContent } from './TradeInputContent'
import { TradeInputHeader } from './TradeInputHeader'
import { FormValues, IProps, IPropsWithFormik } from './types'
import {
  costOfAddingToken,
  costsOfTheFirstTrade,
  costsOfWrappingSOL,
  SOLFeeForTrade
} from './utils'

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
      this.onPriceChange(stripDigitPlaces(marketPriceAfterPairChange, pricePrecision))
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

    let maxAmount = isBuyType ? funds[1].quantity : funds[0].quantity

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
    value: string
  ) => {
    const {
      values: { amount },
      setFieldValue,
    } = this.props

    setFieldValue('price', value)

    const total = stripDigitPlaces(parseFloat(value) * amount, 3)
    this.setFormatted('total', total, 1)
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
      <Container background={'transparent'}>
        <TerminalGridContainer
          isBuyType={isBuyType}
          key={`${pair[0]}/${pair[1]}`}
        >
          <SwitchersContainer>
            <CustomSwitcher
              theme={theme}
              firstHalfText={'buy'}
              secondHalfText={'sell'}
              buttonHeight={'3rem'}
              needBorderRadius={true}
              needBorder={false}
              containerStyles={{
                width: '100%',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-around',
                height: '6rem',
                background: '#383B45',
                borderRadius: '2rem',
                alignItems: 'center',
              }}
              firstHalfStyleProperties={{
                activeColor: '#A5E898',
                activeBackgroundColor: '#222429',
                borderRadius: '3rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              secondHalfStyleProperties={{
                activeColor: '#F69894',
                activeBackgroundColor: '#222429',
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
              firstHalfText={'market'}
              secondHalfText={'limit'}
              buttonHeight={'3rem'}
              needBorderRadius={true}
              needBorder={false}
              containerStyles={{
                width: '100%',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-around',
                height: '6rem',
                background: '#383B45',
                borderRadius: '2rem',
                alignItems: 'center',
                marginTop: '2rem',
              }}
              firstHalfStyleProperties={{
                activeColor: '#fff',
                activeBackgroundColor: '#222429',
                borderRadius: '4rem',
                width: '47%',
                height: '80%',
                fontSize: '1.9rem',
              }}
              secondHalfStyleProperties={{
                activeColor: '#fff',
                activeBackgroundColor: '#222429',
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
                    key={'limit-price'}
                    padding={'.6rem 0'}
                    direction={'column'}
                  >
                    <DecimalInput
                      theme={theme}
                      needTitle
                      type={'text'}
                      title={`price`}
                      value={values.price || ''}
                      onChange={this.onPriceChange}
                      symbol={pair[1]}
                      step={market?.tickSize}
                    />
                  </InputRowContainer>
                ) : null}
              <ButtonsWithAmountFieldRowForBasic
                pair={pair}
                needButtons={true}
                theme={theme}
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
                onAfterSliderChange={(value) => {
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
                }}
              />
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
                    <ConnectWalletDropdown
                      theme={theme}
                      height={'4rem'}
                      id={`${sideType}-connectButton`}
                    />
                  </ConnectWalletDropdownContainer>
                  <ConnectWalletButtonContainer>
                    <BtnCustom
                      theme={theme}
                      onClick={() => this.setState({ isWalletPopupOpen: true })}
                      needMinWidth={false}
                      btnWidth="100%"
                      height="6rem"
                      fontSize="1.6rem"
                      padding="2rem 8rem"
                      borderRadius="1.5rem"
                      borderColor={theme.palette.blue.serum}
                      btnColor={'#fff'}
                      backgroundColor={theme.palette.blue.serum}
                      textTransform={'none'}
                      margin={'1rem 0 0 0'}
                      transition={'all .4s ease-out'}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Connect wallet
                    </BtnCustom>
                  </ConnectWalletButtonContainer>
                </>
              ) : (
                  <InsufficientBalancePlaceholder
                    pair={pair}
                    SOLAmount={SOLAmount}
                    sideType={sideType}
                    theme={theme}
                    onClick={() => onSendOrder({ values, market, wallet })}
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
              />
            </Grid>
          </ButtonBlock>
        </TerminalGridContainer>
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
      priceType !== 'market' &&
        priceType !== 'maker-only'
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

      setSubmitting(false)
    }
  },
})

export default compose(withErrorFallback, formikEnhancer)(TradingTerminal)

export { TradeInputContent, TradeInputHeader, DecimalInput }
