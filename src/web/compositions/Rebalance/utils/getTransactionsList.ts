import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { TokensMapType, TransactionType, PoolInfoElement } from '../Rebalance.types'
import { Graph } from '@core/utils/graph/Graph'
import { REBALANCE_CONFIG } from '../Rebalance.config'


export const getTransactionsList = ({
  tokensDiff,
  poolsInfo,
  tokensMap,
}: {
  tokensDiff: {
    symbol: string
    amountDiff: number
    decimalCount: number
    price: number
  }[]
  poolsInfo: PoolInfoElement[]
  tokensMap: TokensMapType
}): TransactionType[] => {

  const tokensToSell = tokensDiff
    .filter((el) => el.amountDiff < 0)
    .map(el => ({ ...el, tokenValue: +(el.price * Math.abs(el.amountDiff)).toFixed(el.decimalCount), isSold: false }))
    .sort((a,b) => a.tokenValue - b.tokenValue)
  const tokensToBuy = tokensDiff
  .filter((el) => el.amountDiff > 0)
  .map(el => ({ ...el, tokenValue: +(el.price * el.amountDiff).toFixed(el.decimalCount) }))
  .sort((a,b) => b.tokenValue - a.tokenValue)

  if (!tokensToSell || !tokensToBuy) {
    return []
  }

  const poolsInfoMap = poolsInfo.reduce(
    (acc: { [cacheKey: string]: PoolInfoElement }, el) => {
      acc[el.symbol] = el

      return acc
    },
    {}
  )

  let allTransactions: TransactionType[] = []

  const poolsGraph = new Graph()
  poolsInfo.forEach(el => {
    const [base, quote] = el.symbol.split('_')

    poolsGraph.addEdge(base, quote)
    poolsGraph.addEdge(quote, base)
  })

  let i = 0;
  tokensToSell.forEach(elSell => {
    while (elSell.isSold === false) {
      const elBuy = tokensToBuy[i]
      if (!elBuy) {
        break;
      }

      const pathElement = poolsGraph.shortestPath(elSell.symbol, elBuy.symbol) // FTT, USDT || SOL, SRM, USDT, KIN

      // Checking that we want to sell full amount of coin or only part of it
      const diffBuySell = elSell.tokenValue - elBuy.tokenValue
      let toSellTokenAmount = 0

      // Configuring amount to sell
      if (diffBuySell > 0) {
        // if sell token is more than buy token
        toSellTokenAmount = +(elBuy.tokenValue / elSell.price).toFixed(tokensMap[elSell.symbol].decimalCount)
        // buy should go out
        i++;
      } else {
        // if sell token less than buy token
        toSellTokenAmount = Math.abs(elSell.amountDiff)
        // sell should go out
        elSell.isSold = true
      }


      let tempToken = { amount: 0 }
      pathElement?.forEach((pathSymbol: string, index: number, arr: string[]) => {
        const nextElement = arr[index +1]

        // We ended with finding transactions for this path
        if (!nextElement) {
          return
        }

        const poolPair = poolsInfoMap[`${pathSymbol}_${nextElement}`] || poolsInfoMap[`${nextElement}_${pathSymbol}`] // FTT_SOL || SOL_FTT
        // console.log('poolPair: ', poolPair)
        const [base, quote] = poolPair.symbol.split('_')

        const side = base === pathSymbol ? 'sell' : 'buy'
        // const price = tokensMap[base].price / tokensMap[quote].price
        const price = poolPair.price
  
        // Handling case with intermidiate pair inside path
        const pathInString = pathElement.join('_')
        const isIntermidiate = pathInString.match(`_${pathSymbol}_`)
  
        const tokenAmount = isIntermidiate ? tempToken.amount : toSellTokenAmount
        const slippageMultiplicator = (100 - poolsInfoMap[poolPair.symbol].slippage) / 100
        const feeMultiplicator = (100 - REBALANCE_CONFIG.POOL_FEE) / 100
  
        const moduleAmountDiff = tokenAmount
        const amount = +((base === pathSymbol ? moduleAmountDiff : moduleAmountDiff / price) * (side === 'buy' ? slippageMultiplicator : 1) )
        .toFixed(tokensMap[base].decimalCount)
  
        const amountRaw = +((base === pathSymbol ? moduleAmountDiff : moduleAmountDiff / price))
        .toFixed(tokensMap[base].decimalCount)
        
        const total = +(amountRaw * price * (side === 'sell' ? slippageMultiplicator : 1))
        .toFixed(tokensMap[quote].decimalCount)
  
        tempToken.amount = (base === pathSymbol ? total : amount) * feeMultiplicator
  
        allTransactions.push({
          ...poolsInfoMap[poolPair.symbol],
          amount: amount,
          total: total, 
          side,

          // TODO: Fix feeUSD
          feeUSD: poolsInfoMap[poolPair.symbol].slippage / 100 * moduleAmountDiff * tokensMap[pathSymbol].price,
        })

      })


    }
  })

  return [...allTransactions]
}
