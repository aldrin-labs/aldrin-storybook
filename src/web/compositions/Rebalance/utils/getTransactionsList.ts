import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { TokensMapType } from '../Rebalance.types'

export type TransactionType = PoolInfoElement & { amount: number, total?: number, side: 'sell' | 'buy', feeUSD: number }

export type PoolInfoElement = {
  symbol: string
  slippage: number
}

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
}) => {
  const tokensToSell = tokensDiff
    .filter((el) => el.amountDiff < 0)
    .filter((el) => el.symbol !== 'USDT')
  const tokensToBuy = tokensDiff.filter((el) => el.amountDiff > 0)

  if (!tokensToSell || !tokensToBuy) {
    return
  }

  console.log('tokensToSell: ', tokensToSell)
  console.log('tokensToBuy: ', tokensToBuy)

  let transactionsToSell: TransactionType[] = []
  let transactionsToBuy: TransactionType[] = []

  const poolsInfoMap = poolsInfo.reduce(
    (acc: { [cacheKey: string]: PoolInfoElement }, el) => {
      acc[el.symbol] = el

      return acc
    },
    {}
  )

  // process sell transactions
  tokensToSell.forEach((el) => {
    let isPairToUSDTFound = false
    let temp: { pair: string, amount: number } | undefined

    while (!isPairToUSDTFound) {
      let poolPair = poolsInfoMap[`${el.symbol}_USDT`]

      if (temp) {
        const [base, quote] = temp.pair.split('_')

        if (base === el.symbol) {
          poolPair = poolsInfoMap[`${quote}_USDT`]
        } else if (quote === el.symbol) {
          poolPair = poolsInfoMap[`${base}_USDT`]
        }
      }

      // For general case if pair found
      if (poolPair && !temp) {
        const sellAmount = +(
          Math.abs(el.amountDiff) -
          (poolPair.slippage / 100) * Math.abs(el.amountDiff)
        ).toFixed(el.decimalCount)

        const { price } = tokensMap[el.symbol]

        transactionsToSell.push({
          ...poolPair,
          total: sellAmount * price,
          amount: sellAmount,
          side: 'sell',
          feeUSD: +((poolPair.slippage / 100) * Math.abs(el.amountDiff) * el.price).toFixed(2)
        })
        isPairToUSDTFound = true
        break
      }

      // For handling case with another pair
      if (poolPair && temp) {
        // poolPair === SRM_USDT
        // tempPair = SOL_SRM

        const [base, quote] = temp.pair.split('_') // SOL_SRM 
        const symbolForPrice = base === el.symbol ? quote : base

        const amount = +(temp.amount * (100 - poolPair.slippage) / 100).toFixed(tokensMap[symbolForPrice].decimalCount)
        const total = amount * tokensMap[symbolForPrice].price

        transactionsToSell.push({
          ...poolPair,
          amount: amount,
          total: total,
          side: 'sell',
          feeUSD: +((poolPair.slippage / 100) * Math.abs(el.amountDiff) * el.price).toFixed(2)
          
        })
        isPairToUSDTFound = true
        break
      }

      if (!poolPair) {
        const anyPairToToken = poolsInfo.find(
          (poolElement) =>
            (poolElement.symbol.includes(`${el.symbol}_`) ||
              poolElement.symbol.includes(`_${el.symbol}`)) 
              // TOOD: FIX It AND make it an array of temp pairs
              // && poolElement.symbol !== (temp && temp.pair)
        )

        if (anyPairToToken) {
          temp = { pair: anyPairToToken.symbol, amount: 0 }

          const [base, quote] = anyPairToToken.symbol.split('_') // 
          const price = base === el.symbol ? tokensMap[base].price / tokensMap[quote].price : tokensMap[quote].price / tokensMap[base].price
          const side = base === el.symbol ? 'sell' : 'buy'

          const moduleAmountDiff = Math.abs(el.amountDiff)

          // TODO: probably fix amount
          const amount = +(base === el.symbol ? moduleAmountDiff : (moduleAmountDiff / price) * (100 - poolsInfoMap[anyPairToToken.symbol].slippage) / 100).toFixed(el.decimalCount)
          const total = +(base === el.symbol ? amount * price : amount).toFixed(tokensMap[base === el.symbol ? quote : base].decimalCount)

          temp.amount = total

          transactionsToSell.push({
            ...poolsInfoMap[anyPairToToken.symbol],
            amount: amount,
            // TODO: SET SYMBOL
            total: total, 
            // totalUSDT: total * 
            side,
            feeUSD: +((poolsInfoMap[anyPairToToken.symbol].slippage / 100) *
            moduleAmountDiff * el.price).toFixed(2),
          })
          continue
        } else {
          throw new Error('No pools for pair found')
        }
      }
    }
  })

  tokensToBuy.forEach(el => {
    let isPairToDestinationTokenFound = false
    let tempPair: string | undefined

    // while (!isPairToDestinationTokenFound) {
    //   let poolPair = poolsInfoMap[`${el.symbol}_USDT`]

      // if (tempPair) {
      //   const [base, quote] = tempPair.split('_')

      //   if (base === el.symbol) {
      //     poolPair = poolsInfoMap[`${quote}_USDT`]
      //   } else if (quote === el.symbol) {
      //     poolPair = poolsInfoMap[`${base}_USDT`]
      //   }
      // }

      // For general case if pair found, first attemp
      // if (poolPair && !tempPair) {
      //   const buyAmount = +(el.amountDiff - (poolPair.slippage / 100) * el.amountDiff).toFixed(el.decimalCount)

      //   transactionsToBuy.push({
      //     ...poolPair,
      //     amount: buyAmount,
      //     side: 'buy',
      //     feeUSD: +((poolPair.slippage / 100) * el.amountDiff * el.price).toFixed(2)
      //   })
      //   isPairToDestinationTokenFound = false
      //   break
      // }

      // For handling case with another pair
      // if (poolPair && tempPair) {
      //   const [base, quote] = tempPair.split('_')
      //   const symbolForPrice = base === el.symbol ? quote : base
      //   const priceToToken = tokensMap[symbolForPrice].price

      //   const sellAmount = +(
      //     (el.symbol === base
      //       ? (el.price / priceToToken) * Math.abs(el.amountDiff)
      //       : (priceToToken / el.price) * Math.abs(el.amountDiff)) -
      //     (poolPair.slippage / 100) * Math.abs(el.amountDiff)
      //   ).toFixed(el.decimalCount)

      //   transactionsToSell.push({
      //     ...poolPair,
      //     amount: sellAmount,
      //     side: 'sell',
      //     feeUSD: +((poolPair.slippage / 100) * Math.abs(el.amountDiff) * el.price).toFixed(2)
          
      //   })
      //   isPairToUSDTFound = true
      //   break
      // }

    //   if (!poolPair) {
    //     const anyPairToToken = poolsInfo.find(
    //       (poolElement) =>
    //         (poolElement.symbol.includes(`${el.symbol}_`) ||
    //           poolElement.symbol.includes(`_${el.symbol}`)) &&
    //         poolElement.symbol !== tempPair
    //     )

    //     if (anyPairToToken) {
    //       tempPair = anyPairToToken.symbol

    //       // TODO: probably fix amount
    //       const sellAmount = +(
    //         Math.abs(el.amountDiff) -
    //         (poolsInfoMap[anyPairToToken.symbol].slippage / 100) *
    //           Math.abs(el.amountDiff)
    //       ).toFixed(el.decimalCount)

    //       transactionsToSell.push({
    //         ...poolsInfoMap[anyPairToToken.symbol],
    //         amount: sellAmount,
    //         side: 'sell',
    //         feeUSD: +((poolsInfoMap[anyPairToToken.symbol].slippage / 100) *
    //         Math.abs(el.amountDiff) * el.price).toFixed(2)
    //       })
    //       continue
    //     } else {
    //       throw new Error('No pools for pair found')
    //     }
    //   }
    // }
    // }
  
  })

  return [...transactionsToSell, ...transactionsToBuy]
}
