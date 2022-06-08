import { addSerumTransaction } from '@core/graphql/mutations/chart/addSerumTransaction'
import { roundDown } from '@core/utils/chartPageUtils'
import { addGAEvent } from '@core/utils/ga.utils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { getFeeRates } from '@project-serum/serum'
import TradingWrapper from '@sb/components/TradingWrapper'
import { useConnection } from '@sb/dexUtils/connection'
import {
  useBaseCurrencyBalances,
  useFeeDiscountKeys, useMarket,
  useMarkPrice,
  useOpenOrdersAccounts, useOrderbook, useQuoteCurrencyBalances,
  useSelectedBaseCurrencyAccount, useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { cancelOrder, placeOrder } from '@sb/dexUtils/send'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { useBalanceInfo, useWallet } from '@sb/dexUtils/wallet'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { IProps } from './types'
import { getPriceForMarketOrderBasedOnOrderbook } from './utils'


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const TradingComponent = (props: IProps) => {
  const {
    pair,
    theme,
    enqueueSnackbar,
    showOrderResult,
    showCancelResult,
    getActivePositionsQuery,
    selectedKey,
    getPriceQuery,
    getLeverageQuery,
    marketType,
    quantityPrecision,
    pricePrecision,
    minSpotNotional,
    minFuturesStep,
    maxLeverage,
    isDefaultTerminalViewMode,
    updateTerminalViewMode,
    priceFromOrderbook,
    getStrategySettingsQuery,
    getKeys,
    sizeDigits,
    chartPagePopup,
    closeChartPagePopup,
    addSerumTransactionMutation,
    setShowTokenNotAdded,
    terminalViewMode,
  } = props

  const { baseCurrency, quoteCurrency, market } = useMarket()
  const { wallet, setAutoConnect, providerUrl, setProvider } = useWallet()
  const markPrice = useMarkPrice()
  const [orderbook] = useOrderbook()
  const [feeAccounts] = useFeeDiscountKeys()
  const connection = useConnection()

  const baseCurrencyAccount = useSelectedBaseCurrencyAccount()
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount()
  const openOrdersAccount = useSelectedOpenOrdersAccount(true)
  const [baseCurrencyBalances] = useBaseCurrencyBalances()
  const [quoteCurrencyBalances] = useQuoteCurrencyBalances()
  const [openOrdersAccounts] = useOpenOrdersAccounts()
  const [isButtonLoaderShowing, setIsButtonLoaderShowing] = useState(false)

  const availableQuote = openOrdersAccount
    ? market.quoteSplSizeToNumber(openOrdersAccount.quoteTokenFree)
    : 0

  let quoteBalance = (quoteCurrencyBalances || 0) + (availableQuote || 0)
  let baseBalance = baseCurrencyBalances || 0
  let priceDecimalCount = market?.tickSize && getDecimalCount(market.tickSize)

  const currencyPair = pair.join('_')

  const [intervalId, updateIntervalId] = useState(null)

  const balanceInfo = useBalanceInfo(wallet.publicKey)

  useEffect(() => {
    return () => {
      clearInterval(intervalId)
      updateIntervalId(null)
    }
  }, [])

  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  }

  const SOLAmount = amount / Math.pow(10, decimals)

  // getting values for the trading terminal pair
  const funds = [
    { quantity: baseBalance, value: baseBalance },
    { quantity: quoteBalance, value: quoteBalance },
  ]

  const [USDTFuturesFund = { quantity: 0, value: 0 }] = [
    { quantity: baseBalance, value: quoteBalance },
  ]

  const currentPositions = (getActivePositionsQuery &&
    getActivePositionsQuery.getActivePositions.filter((position) => {
      return (
        position.symbol === currencyPair &&
        marketType === 1 &&
        position.keyId === selectedKey.keyId
      )
    })) || [
    { positionAmt: 0, positionSide: 'BOTH' },
    { positionAmt: 0, positionSide: 'LONG' },
    { positionAmt: 0, positionSide: 'SHORT' },
  ]

  const hedgeMode = selectedKey.hedgeMode

  const processedFunds =
    marketType === 0 ? funds : [funds[0], USDTFuturesFund, currentPositions]

  const placeOrderFunc = async (
    byType,
    priceType = 'market',
    values = {},
    futuresValues: {
      postOnly: boolean
      stopPrice: number
      reduceOnly: boolean
      timeInForce: string
      leverage: number
      takeProfit: boolean
      takeProfitPercentage: number
      breakEvenPoint: boolean
      tradingBotEnabled: boolean
      tradingBotInterval: number
      tradingBotTotalTime: number
    } = {
      postOnly: false,
      stopPrice: 0,
      reduceOnly: false,
      timeInForce: 'GTC',
      leverage: 1,
      takeProfit: false,
      takeProfitPercentage: 0,
      breakEvenPoint: false,
      tradingBotEnabled: false,
      tradingBotInterval: 30,
      tradingBotTotalTime: 60,
    }
  ): Promise<{ status: string; message: string; orderId?: number }> => {
    const {
      breakEvenPoint,
      takeProfit,
      takeProfitPercentage,
      tradingBotEnabled,
      tradingBotInterval,
      tradingBotTotalTime,
    } = futuresValues

    if (!wallet.connected) {
      wallet.connect()
      return { status: 'ERR', message: 'Wallet not connected' }
    }

    setIsButtonLoaderShowing(true)

    // if (!baseCurrencyAccount || !quoteCurrencyAccount) {
    //   setShowTokenNotAdded(true)
    //   return { status: 'ERR', message: 'Token not added' }
    // }

    const startTimestampInSeconds = Math.floor(Date.now() / 1000)

    let priceForOrder = +values.price
    const quoteBalanceWithoutFee = quoteBalance * 0.997

    console.log('orderbook', orderbook)

    if (priceType === 'market') {
      if (byType === 'sell' && orderbook.bids) {
        priceForOrder = getPriceForMarketOrderBasedOnOrderbook(
          +values.amount,
          byType,
          orderbook
        )
      } else {
        priceForOrder = getPriceForMarketOrderBasedOnOrderbook(
          +values.amount,
          byType,
          orderbook
        )
      }
    }

    const minOrderSize = market?.minOrderSize

    let funcToRound =
      minOrderSize >= 1
        ? (num) => roundDown(num, minOrderSize)
        : (num, precision) => stripDigitPlaces(num, precision)

    const orderSizeForMarketBuy =
      priceForOrder * +values.amount > quoteBalanceWithoutFee
        ? quoteBalanceWithoutFee / priceForOrder
        : +values.amount
    const orderSize =
      priceType === 'market' && byType === 'buy'
        ? +funcToRound(orderSizeForMarketBuy, sizeDigits)
        : +funcToRound(+values.amount, sizeDigits)

    // console.log('sizeDigits', sizeDigits)
    // console.log('orderSize before', +values.amount)
    // console.log('orderSize after', orderSize)

    const variables = {
      side: byType,
      price: priceForOrder,
      pair: currencyPair,
      size: +orderSize,
      orderType:
        futuresValues.orderMode === 'postOnly'
          ? 'postOnly'
          : futuresValues.orderMode === 'ioc'
          ? 'ioc'
          : 'limit',
      isMarketOrder: priceType === 'market',
      market,
      wallet,
      connection,
      openOrdersAccount,
      baseCurrencyAccount,
      quoteCurrencyAccount,
      feeAccounts,
      addSerumTransactionMutation,
    }

    console.log('variables for placing', variables)

    const placeOrderWithTP = async () => {
      let resultEntryOrder // txId
      let resultCloseOrder

      try {
        resultEntryOrder = await placeOrder(variables)

        if (
          (takeProfit || (breakEvenPoint && currencyPair === 'SRM_USDT')) &&
          priceType === 'market'
        ) {
          let orderPlaced = false
          let attempts = 0

          // we'll try to place TP order for 1 min
          while (attempts <= 20 && !orderPlaced) {
            const fills = await market.loadFills(connection, 100)
            const filteredFills = fills.filter((fill) =>
              openOrdersAccounts.some((openOrdersAccount) =>
                fill.openOrders.equals(openOrdersAccount.publicKey)
              )
            )

            if (filteredFills.length > 0) {
              filteredFills.forEach(async (fill) => {
                const isAmountEqual =
                  +funcToRound(fill.size, sizeDigits) ===
                  +funcToRound(values.amount, sizeDigits)

                if (fill.side === byType && isAmountEqual && !orderPlaced) {
                  const price = fill.price
                  let takeProfitOrderPrice = 0

                  if (takeProfit) {
                    takeProfitOrderPrice =
                      (price * (100 + +takeProfitPercentage)) / 100
                  } else if (breakEvenPoint) {
                    takeProfitOrderPrice =
                      (price *
                        (100 +
                          (getFeeRates(feeAccounts[0].feeTier).taker +
                            getFeeRates(feeAccounts[0].feeTier).maker) *
                            100)) /
                      100
                  }

                  orderPlaced = true

                  resultCloseOrder = await placeOrder({
                    ...variables,
                    orderType: 'limit',
                    size: +fill.size,
                    side: byType === 'buy' ? 'sell' : 'buy',
                    price: +takeProfitOrderPrice.toFixed(pricePrecision),
                    openOrdersAccount,
                  })
                }
              })
            }

            await sleep(3000)
            attempts += 1
          }
        }

        return [resultEntryOrder, resultCloseOrder]
      } catch (e) {
        console.warn(e)
        notify({
          message: e.message,
          type: 'error',
        })

        return [null, null]
      }
    }

    // console.log('tradingBotEnabled', tradingBotEnabled)
    if (tradingBotEnabled) {
      await placeOrderWithTP()

      const intervalId = setInterval(async () => {
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000)

        if (
          currentTimestampInSeconds - startTimestampInSeconds >
          tradingBotTotalTime * 60
        ) {
          clearInterval(intervalId)
          updateIntervalId(null)
        } else {
          const [entryOrderResult, closeOrderResult] = await placeOrderWithTP()
          // handle error when balance
          // if (entryOrderResult == null || closeOrderResult == null) {
          // }
        }
      }, tradingBotInterval * 1000)

      updateIntervalId(intervalId)
    } else if (takeProfit) {
      await placeOrderWithTP()
    } else {
      try {
        await placeOrder(variables)
      } catch (e) {
        console.warn(e)
        notify({
          message: e.message,
          type: 'error',
        })
      }
    }

    addGAEvent({
      action: 'Create order',
      category: 'App - Create order',
      label: `create_simple_order_on_${marketType ? `futures` : `spot`}`,
    })

    setIsButtonLoaderShowing(false)
  }

  const cancelOrderFunc = async (order) => {
    try {
      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
      })
    } catch (e) {
      notify({
        message: 'Error cancelling order',
        description: e.message,
        type: 'error',
      })

      return
    }
  }

  const [base, quote] = pair || ['', '']
  /* tslint:disable-next-line:no-object-mutation */
  if (markPrice) {
    document.title = `${markPrice?.toFixed(
      priceDecimalCount
    )} ${base} to ${quote} | Aldrin`
  }

  const bestAsk =
    orderbook && orderbook.asks && orderbook.asks[0] && orderbook.asks[0][0]
  const bestBid =
    orderbook && orderbook.bids && orderbook.bids[0] && orderbook.bids[0][0]
  const spread = (bestAsk / bestBid - 1) * 100

  return (
    <TradingWrapper
      isButtonLoaderShowing={isButtonLoaderShowing}
      minOrderSize={market?.minOrderSize}
      key={`${pair}${processedFunds}`}
      keyId={selectedKey.keyId}
      theme={theme}
      isFuturesWarsKey={selectedKey.isFuturesWarsKey}
      pair={pair}
      funds={processedFunds}
      enqueueSnackbar={enqueueSnackbar}
      price={markPrice}
      SOLAmount={SOLAmount}
      openOrdersAccount={openOrdersAccount}
      // marketPriceAfterPairChange={marketPriceAfterPairChange}
      quantityPrecision={quantityPrecision}
      pricePrecision={pricePrecision}
      minSpotNotional={minSpotNotional}
      minFuturesStep={minFuturesStep}
      leverage={1}
      market={market}
      marketType={marketType}
      hedgeMode={hedgeMode}
      placeOrder={placeOrderFunc}
      chartPagePopup={chartPagePopup}
      closeChartPagePopup={closeChartPagePopup}
      cancelOrder={cancelOrderFunc}
      showOrderResult={showOrderResult}
      showCancelResult={showCancelResult}
      priceFromOrderbook={priceFromOrderbook}
      maxLeverage={maxLeverage}
      updateTerminalViewMode={updateTerminalViewMode}
      getStrategySettingsQuery={getStrategySettingsQuery}
      intervalId={intervalId}
      updateIntervalId={updateIntervalId}
      connected={wallet.connected}
      wallet={wallet}
      spread={spread}
      setAutoConnect={setAutoConnect}
      terminalViewMode={terminalViewMode}
      providerUrl={providerUrl}
      setProvider={setProvider}
    />
  )
}

export default compose(
  withSnackbar,
  graphql(addSerumTransaction, { name: 'addSerumTransactionMutation' })
)(TradingComponent)
