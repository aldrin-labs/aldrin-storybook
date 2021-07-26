import {
  TokensMapType,
  TransactionType,
  MarketDataProcessed,
  MarketData,
} from '../Rebalance.types'
import { Graph } from '@core/utils/graph/Graph'
import { REBALANCE_CONFIG } from '../Rebalance.config'

export const getTransactionsList = ({
  tokensDiff,
  transactionsPrices,
  tokensMap,
  marketsData,
}: {
  tokensDiff: {
    symbol: string
    amountDiff: number
    decimalCount: number
    price: number
  }[]
  marketsData: MarketData[]
  transactionsPrices: { price: number; symbol: string, notEnoughLiquidity: boolean }[]
  tokensMap: TokensMapType
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

  const poolsGraph = new Graph()
  marketsData.forEach((el) => {
    const [base, quote] = el.name.split('_')

    poolsGraph.addEdge(base, quote)
    poolsGraph.addEdge(quote, base)
  })

  let i = 0
  let transactionIndex = 0;
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

          const { symbol, price, notEnoughLiquidity } = transactionsPrices[transactionIndex] || {
            price: 0,
            symbol: market.name,
            notEnoughLiquidity: true,
          }

          const [base, quote] = symbol.split('_')

          const side = base === pathSymbol ? 'sell' : 'buy'

          // Handling case with intermidiate pair inside path
          const pathInString = pathElement.join('_')
          const isIntermidiate = pathInString.match(`_${pathSymbol}_`)

          const tokenAmount = isIntermidiate
            ? tempToken.amount
            : toSellTokenAmount
          const feeMultiplicator = (100 - REBALANCE_CONFIG.POOL_FEE) / 100

          console.log(
            'toSellTokenAmount',
            isIntermidiate,
            tempToken.amount,
            toSellTokenAmount,
            `${pathSymbol}_${nextElement}`,
            elSell,
            elBuy
          )

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

          allTransactions.push({
            tokenA: base,
            tokenB: quote,
            rawAmount: tokenAmount,
            amount: amount,
            total: total,
            price,
            symbol,
            side,
            name: symbol,
            feeUSD: feeUSD,
            address: market?.address,
            notEnoughLiquidity,
            priceIncludingCurveAndFees: priceIncludingCurveAndFees,
          })

          transactionIndex++;
        }
      )
    }
  })

  return [...allTransactions]
}
