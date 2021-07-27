import {
  TokensMapType,
  TransactionType,
  MarketDataProcessed,
  MarketData,
  TokensDiff,
  Orderbooks,
} from '../Rebalance.types'
import { Graph } from '@core/utils/graph/Graph'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { LoadedMarketsMap } from './loadMarketsByNames'
import { getPricesForTransactionsFromOrderbook } from './getPricesForTransactionsFromOrderbook'

export const getTransactionsList = ({
  tokensDiff,
  tokensMap,
  marketsData,
  loadedMarketsMap,
  orderbooks,
}: {
  tokensDiff: TokensDiff
  marketsData: MarketData[]
  tokensMap: TokensMapType
  loadedMarketsMap: LoadedMarketsMap
  orderbooks: Orderbooks
}): TransactionType[] => {
  const tokensToSell = tokensDiff
    .filter((el) => el.amountDiff < 0)
    .map((el) => ({
      ...el,
      tokenValue: +(el.price * Math.abs(el.amountDiff)).toFixed(
        el.decimalCount
      ),
      isSold: false,
    }))
    .sort((a, b) => a.tokenValue - b.tokenValue)

  const tokensToBuy = tokensDiff
    .filter((el) => el.amountDiff > 0)
    .map((el) => ({
      ...el,
      tokenValue: +(el.price * el.amountDiff).toFixed(el.decimalCount),
    }))
    .sort((a, b) => b.tokenValue - a.tokenValue)

  if (!tokensToSell || !tokensToBuy) {
    return []
  }

  let allTransactions: TransactionType[] = []
  // we'll change orderbook in each transaction
  let orderbooksClone = { ...orderbooks }

  const poolsGraph = new Graph()
  marketsData.forEach((el) => {
    const [base, quote] = el.name.split('_')

    poolsGraph.addEdge(base, quote)
    poolsGraph.addEdge(quote, base)
  })

  let i = 0

  tokensToSell.forEach((elSell) => {
    while (elSell.isSold === false) {
      const elBuy = tokensToBuy[i]
      if (!elBuy) {
        break
      }

      const pathElement = poolsGraph.shortestPath(elSell.symbol, elBuy.symbol) // FTT, USDT || SOL, SRM, USDT, KIN

      // Checking that we want to sell full amount of coin or only part of it
      const diffBuySell = elSell.tokenValue - elBuy.tokenValue
      let toSellTokenAmount = 0

      // Configuring amount to sell
      if (diffBuySell > 0) {
        // if sell token is more than buy token
        toSellTokenAmount = +(elBuy.tokenValue / elSell.price).toFixed(
          tokensMap[elSell.symbol].decimalCount
        )
        // buy should go out
        i++
      } else {
        // if sell token less than buy token
        toSellTokenAmount = Math.abs(elSell.amountDiff)
        // sell should go out
        elSell.isSold = true
      }

      let tempToken = { amount: 0 }
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
          const feeMultiplicator = (100 - REBALANCE_CONFIG.POOL_FEE) / 100

          // we're getting price from ob here because price is required  
          // to get total from amount for next rebalance chain element 
          const [
            [{ price, notEnoughLiquidity }],
            updatedOrderbooks,
          ] = getPricesForTransactionsFromOrderbook({
            orderbooks: orderbooksClone,
            transactionsList: [{ side, amount: tokenAmount, symbol }],
          })

          // update orderbook data due to making some updates in this transaction 
          // so in next t-on this orders will be included
          orderbooksClone = updatedOrderbooks

          const moduleAmountDiff = tokenAmount
          const amountRaw = +(base === pathSymbol
            ? moduleAmountDiff
            : moduleAmountDiff / price
          ).toFixed(tokensMap[base].decimalCount)

          const totalRaw = +(amountRaw * price).toFixed(
            tokensMap[quote].decimalCount
          )

          // getting slippage
          // const poolsAmountDiff = side === 'sell' ? poolPair.tokenA / amountRaw : poolPair.tokenB / totalRaw
          // const rawSlippage = 100 / (poolsAmountDiff + 1)
          const slippage = REBALANCE_CONFIG.POOL_FEE
          const slippageMultiplicator = (100 - slippage) / 100

          // console.log('poolsAmountDiff: ', poolsAmountDiff)
          // console.log('rawSlippage: ', rawSlippage)
          // console.log('slippage: ', slippage)

          const amount = +(
            (base === pathSymbol
              ? moduleAmountDiff
              : moduleAmountDiff / price) *
            (side === 'buy' ? slippageMultiplicator : 1)
          ).toFixed(tokensMap[base].decimalCount)

          // console.log('price', price)

          const total = +(
            amountRaw *
            price *
            (side === 'sell' ? slippageMultiplicator : 1)
          ).toFixed(tokensMap[quote].decimalCount)

          // console.log(
          //   `side ${side}, amountRaw: ${amountRaw}, totalRaw ${totalRaw}, finalAmount ${amount}, finalTotal ${total}`
          // )

          tempToken.amount =
            (base === pathSymbol ? total : amount) * feeMultiplicator

          const priceIncludingCurveAndFees = total / amount

          const feeUSD =
            (side === 'sell'
              ? totalRaw - totalRaw * feeMultiplicator
              : amountRaw - amountRaw * feeMultiplicator) *
            tokensMap[side === 'sell' ? quote : base].price

          const loadedMarket = loadedMarketsMap[symbol]

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
            name: symbol,
            feeUSD: feeUSD,
            address: market?.address,
            notEnoughLiquidity,
            isIntermidiate,
            priceIncludingCurveAndFees: priceIncludingCurveAndFees,
          })
        }
      )
    }
  })

  return [...allTransactions]
}
