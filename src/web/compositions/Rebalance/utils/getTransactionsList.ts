import { Graph } from '@core/utils/graph/Graph'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { MarketsMap } from '@sb/dexUtils/markets'
import { TokensMapType, TransactionType, Orderbooks } from '../Rebalance.types'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { getPricesForTransactionsFromOrderbook } from './getPricesForTransactionsFromOrderbook'
import { getTokensToBuy } from './getTokensToBuy'
import { getTokensToSell } from './getTokensToSell'
import { getMarketsData } from './getMarketsData'
import { LoadedMarketsWithVaultSignersAndOpenOrdersMap } from './loadMarketsWithDataForTransactions'

export const getTransactionsList = ({
  tokensMap,
  loadedMarketsMap,
  orderbooks,
  allMarketsMap,
}: {
  tokensMap: TokensMapType
  loadedMarketsMap: LoadedMarketsWithVaultSignersAndOpenOrdersMap
  orderbooks: Orderbooks
  allMarketsMap: MarketsMap
}): TransactionType[] => {
  const marketsData = getMarketsData(allMarketsMap)
  const tokensToSell = getTokensToSell(tokensMap)
  const tokensToBuy = getTokensToBuy(tokensMap)

  //
  const tokensToBuyClone = [...tokensToBuy]

  if (!tokensToSell || !tokensToBuyClone) {
    return []
  }

  const allTransactions: TransactionType[] = []

  // we'll change orderbook in each transaction
  let orderbooksClone = { ...orderbooks }

  const marketsGraph = new Graph()
  marketsData.forEach((el) => {
    const [base, quote] = el.name.split('_')

    marketsGraph.addEdge(base, quote)
    marketsGraph.addEdge(quote, base)
  })

  let i = 0

  tokensToSell.forEach((elSellRaw) => {
    // we need to mutate elSell to keep in updated on every buy token iteration
    const elSell = { ...elSellRaw }

    while (elSell.isSold === false) {
      const elBuy = { ...tokensToBuyClone[i] }

      if (!elBuy?.symbol) {
        break
      }

      const pathElement = marketsGraph.shortestPath(elSell.symbol, elBuy.symbol) // FTT, USDT || SOL, SRM, USDT, KIN

      // Checking that we want to sell full amount of coin or only part of it
      const diffBuySell = elSell.tokenValue - elBuy.tokenValue
      let toSellTokenAmount = 0

      // Configuring amount to sell
      // for sell we have more amount then for buy with same index
      if (diffBuySell > 0) {
        // if sell token is more than buy token
        toSellTokenAmount = +(elBuy.tokenValue / elSell.price).toFixed(
          tokensMap[elSell.symbol].decimalCount
        )

        // remove part from sell, that sold
        elSell.tokenValue -= elBuy.tokenValue
        elSell.amountDiff += toSellTokenAmount

        // buy should go out
        i++
      } else {
        // if sell token less than buy token
        toSellTokenAmount = Math.abs(elSell.amountDiff)
        // console.log('tokensMap', tokensMap, elBuy)

        // remove part from buy, that bought
        tokensToBuyClone[i] = {
          ...elBuy,
          tokenValue: elBuy.tokenValue - elSell.tokenValue,
          amountDiff:
            elBuy.amountDiff -
            +(elSell.tokenValue / elBuy.price).toFixed(
              tokensMap[elBuy.symbol].decimalCount
            ),
        }

        // sell should go out
        elSell.isSold = true
      }

      const tempToken = { amount: 0 }
      pathElement?.forEach(
        (pathSymbol: string, index: number, arr: string[]) => {
          const nextElement = arr[index + 1]

          // We ended with finding transactions for this path
          if (!nextElement) {
            return
          }

          const market = marketsData.find(
            (market) =>
              market.name === `${pathSymbol}_${nextElement}` ||
              market.name === `${nextElement}_${pathSymbol}`
          )

          const symbol = market?.name || ''
          const [base, quote] = symbol.split('_')
          const side = base === pathSymbol ? 'sell' : 'buy'

          // Handling case with intermidiate pair inside path
          const pathInString = pathElement.join('_')
          const isIntermidiate = !!pathInString.match(`_${pathSymbol}_`)

          const tokenAmount = isIntermidiate
            ? tempToken.amount
            : toSellTokenAmount

          // console.log('tokenAmount', tokenAmount)

          const feeMultiplicator = (100 - REBALANCE_CONFIG.SLIPPAGE) / 100

          const {
            market: loadedMarket,
            openOrders,
            vaultSigner,
          } = loadedMarketsMap.get(symbol) || {
            market: null,
            openOrders: null,
            vaultSigner: null,
          }

          const quantityPrecision =
            loadedMarket?.minOrderSize &&
            getDecimalCount(loadedMarket.minOrderSize)

          const pricePrecision =
            loadedMarket?.tickSize && getDecimalCount(loadedMarket.tickSize)

          // we're getting price from ob here because price is required
          // to get total from amount for next rebalance chain element
          let [[{ price, isNotEnoughLiquidity }], updatedOrderbooks] =
            getPricesForTransactionsFromOrderbook({
              orderbooks: orderbooksClone,
              transactionsList: [{ side, amount: tokenAmount, symbol }],
            })

          price = +stripDigitPlaces(
            price,
            pricePrecision,
            loadedMarket?.tickSize
          )

          // update orderbook data due to making some updates in this transaction
          // so in next t-on this orders will be included
          orderbooksClone = updatedOrderbooks

          const slippage = REBALANCE_CONFIG.SLIPPAGE
          const slippageMultiplicator = (100 - slippage) / 100

          const moduleAmountDiff = tokenAmount
          const amount =
            +stripDigitPlaces(
              base === pathSymbol
                ? moduleAmountDiff
                : (moduleAmountDiff / price) *
                    (side === 'buy' ? slippageMultiplicator : 1),
              quantityPrecision,
              loadedMarket?.minOrderSize
            ) || 0

          const totalRaw = +(amount * price).toFixed(
            tokensMap[quote].decimalCount
          )

          const total = +(
            amount *
            price *
            (side === 'sell' ? slippageMultiplicator : 1)
          )

          tempToken.amount =
            (base === pathSymbol ? total : amount) * feeMultiplicator

          const priceIncludingCurveAndFees = total / amount

          const feeUSD =
            (side === 'sell'
              ? totalRaw - totalRaw * feeMultiplicator
              : amount - amount * feeMultiplicator) *
            tokensMap[side === 'sell' ? quote : base].price

          allTransactions.push({
            tokenA: base,
            tokenB: quote,
            amount,
            total,
            price,
            symbol,
            side,
            slippage,
            loadedMarket,
            openOrders,
            vaultSigner,
            name: symbol,
            feeUSD,
            address: market?.address,
            isNotEnoughLiquidity,
            isIntermidiate,
            priceIncludingCurveAndFees,
            depthLevel: index,
          })
        }
      )
    }
  })

  return [...allTransactions]
}
