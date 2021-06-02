import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { TokensMapType, TransactionType, PoolInfoElement } from '../Rebalance.types'
import { Graph } from '@core/utils/graph/Graph'
import { REBALANCE_CONFIG } from '../Rebalance.config'


// TODO: Remove _symbol or symbol_

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
    .filter((el) => el.symbol !== 'USDT')
  const tokensToBuy = tokensDiff
  .filter((el) => el.amountDiff > 0)
  .map(el => ({ ...el, tokenValue: +(el.price * el.amountDiff).toFixed(el.decimalCount) }))
  .sort((a,b) => a.tokenValue - b.tokenValue)

  if (!tokensToSell || !tokensToBuy) {
    return
  }

  const tokensToSellMap = tokensToSell.reduce((acc, el) => {
    acc[el.symbol] = el

    return acc
  }, {})


  // console.log('tokensToSellMap: ', tokensToSellMap)
  // console.log('tokensToSell: ', tokensToSell)
  // console.log('tokensToBuy: ', tokensToBuy)

  let transactionsToSell: TransactionType[] = []
  let transactionsToBuy: TransactionType[] = []

  const poolsInfoMap = poolsInfo.reduce(
    (acc: { [cacheKey: string]: PoolInfoElement }, el) => {
      acc[el.symbol] = el

      return acc
    },
    {}
  )

  const expectedTotalUSDT = tokensToBuy.reduce((acc: number, el) => acc + el.tokenValue, 0)
  const containsUSDT = tokensDiff.find(el => el.symbol === 'USDT' && el.amountDiff < 0)
  let realTotalUSDT = containsUSDT ? Math.abs(containsUSDT.amountDiff) : 0

  // Creating graph with pools
  const poolsGraph = new Graph()
  poolsInfo.forEach(el => {
    const [base, quote] = el.symbol.split('_')

    poolsGraph.addEdge(base, quote)
    poolsGraph.addEdge(quote, base)
  })


  const pathToSell = tokensToSell.map((el) => {
    const path = poolsGraph.shortestPath(el.symbol, 'USDT')
    // console.log('graph path: ', path)

    return path
  })

  // TODO: Handle case with USDT_USDT
  const pathToBuy = tokensToBuy
  .map((el) => {
    const path = poolsGraph.shortestPath('USDT', el.symbol)
    return path
  })

  pathToSell.forEach((pathElement: any) => {
    let tempToken = { amount: 0 }

    pathElement.forEach((pathSymbol: string, index: number, arr: string[]) => {
      const nextElement = arr[index +1]

      // We ended with finding transactions for this path
      if (!nextElement) {
        return
      }

      const poolPair = poolsInfoMap[`${pathSymbol}_${nextElement}`] || poolsInfoMap[`${nextElement}_${pathSymbol}`] // FTT_SOL || SOL_FTT
      const [base, quote] = poolPair.symbol.split('_')

      const side = base === pathSymbol ? 'sell' : 'buy'
      // const price = tokensMap[base].price / tokensMap[quote].price
      const price = poolPair.price

      // Handling case with intermidiate pair inside path
      const pathInString = pathElement.join('_')
      const isIntermidiate = pathInString.match(`_${pathSymbol}_`)

      const tokenAmount = isIntermidiate ? tempToken.amount : Math.abs(tokensToSellMap[pathSymbol].amountDiff)
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

      if (nextElement === 'USDT') {
        realTotalUSDT = realTotalUSDT + (base === pathSymbol ? total : amount) * feeMultiplicator
      }

      transactionsToSell.push({
        ...poolsInfoMap[poolPair.symbol],
        amount: amount,
        total: total, 
        side,

        feeUSD: poolsInfoMap[poolPair.symbol].slippage / 100 * moduleAmountDiff * tokensMap[pathSymbol].price,
      })

    });

  })


  // console.log('realTotalUSDT: ', realTotalUSDT)
  // console.log('pathToBuy: ', pathToBuy)

  const tokensToBuyWhichRespectsTotalUSDT = tokensToBuy.map(el => {
  const amount = el.amountDiff * realTotalUSDT / expectedTotalUSDT
  const total = amount * el.price

    return {...el, tokenValueDiff: total, amountDiff: amount}
  })

  const tokensToBuyWhichRespectsTotalUSDTMap = tokensToBuyWhichRespectsTotalUSDT.reduce((acc, el) => {
    acc[el.symbol] = el

    return acc
  }, {})

  // console.log('tokensToBuyWhichRespectsTotalUSDTMap: ', tokensToBuyWhichRespectsTotalUSDTMap)
  // console.log('pathToBuy: ', pathToBuy)

  pathToBuy.forEach((pathElement: any) => {
    const destinationToken = pathElement[pathElement.length - 1]
    let tempToken = { amount: tokensToBuyWhichRespectsTotalUSDTMap[destinationToken].tokenValueDiff }


    // Handling case with USDT_USDT
    if (pathElement.length === 2 && pathElement[0] === pathElement[1] && pathElement[0] === 'USDT') {
      return
    }


    pathElement.forEach((pathSymbol: string, index: number, arr: string[]) => {
      const nextElement = arr[index +1]

      // We ended with finding transactions for this path
      if (!nextElement) {
        return
      }

      const poolPair = poolsInfoMap[`${pathSymbol}_${nextElement}`] || poolsInfoMap[`${nextElement}_${pathSymbol}`] 
      // console.log('poolPair: ', poolPair)
      const [base, quote] = poolPair.symbol.split('_') // 

      const side = base === pathSymbol ? 'sell' : 'buy'
      // const price = tokensMap[base].price / tokensMap[quote].price
      const price = poolPair.price

      // Handling case with intermidiate pair inside path
      const pathInString = pathElement.join('_')
      const isIntermidiate = pathInString.match(`_${pathSymbol}_`) || index === 0

      const tokenAmount = isIntermidiate ? tempToken.amount : Math.abs(tokensToBuyWhichRespectsTotalUSDTMap[pathSymbol].amountDiff)

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

      if (nextElement === 'USDT') {
        realTotalUSDT = realTotalUSDT - total * feeMultiplicator
      }

      transactionsToBuy.push({
        ...poolsInfoMap[poolPair.symbol],
        amount: amount,
        total: total, 
        side,

        feeUSD: poolsInfoMap[poolPair.symbol].slippage / 100 * moduleAmountDiff * tokensMap[pathSymbol].price,
      })

    });

  })

  // console.log('transactionsToSell: ', transactionsToSell)
  // console.log('transactionsToBuy: ', transactionsToBuy)

  return [...transactionsToSell, ...transactionsToBuy]
}
