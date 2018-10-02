import { RowT } from '@containers/Portfolio/components/PortfolioTable/types'
import React from 'react'
import { Icon } from '@styles/cssUtils'

export const calcAllSumOfPortfolioAsset = (
  assets: any,
  isUSDCurrently: boolean,
  cryptoWallets: any = null,
): number => {
  // transforming data like assets from profile to IData format
  const sum = assets.filter(Boolean).reduce((acc: number, curr: any) => {
    const { quantity = 0, asset = { priceUSD: 0 } } = curr || {}
    if (!quantity || !asset || !asset.priceUSD || !asset.priceBTC) {
      return null
    }
    const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC

    return acc + quantity * Number(price)
  }, 0);
  if (cryptoWallets) {
    return cryptoWallets.reduce((acc: number, curr: any) =>
      curr.assets.reduce((acc: number, curr: any) => {
        const { balance = 0, asset = { priceUSD: 0 } } = curr || {}
        if (!balance || !asset || !asset.priceUSD || !asset.priceBTC) {
          return null
        }
        const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC

        return acc + balance * Number(price)
      }, 0), sum)
  }

  return sum;
}


export const calcSumOfPortfolioAssetProfitLoss = (
  PLs: any,
  isUSDCurrently: boolean
): number => {
  return PLs.reduce((acc: number, curr: any) => {
    const { realized = 0, price, basePriceUSD, basePriceBTC, averageBuyPrice, totalBuyQty, totalSellQty } = curr || {}

    if (!basePriceUSD || !basePriceBTC) {
      return acc;
    }
    //  pl_unrealized_points = (last_price - average_buy_price) * (total_buy_qty - total_sell_qty);

    const basePrice = (isUSDCurrently ? basePriceUSD : basePriceBTC);
    const unrealizedPL = (price - averageBuyPrice) * (totalBuyQty - totalSellQty) * basePrice;
    const realizedPL = realized * basePrice;

    acc.unrealized += unrealizedPL;
    acc.realized += realizedPL;
    acc.total += realizedPL + unrealizedPL;

    return acc
  }, { unrealized: 0, realized: 0, total: 0 });
}

export const percentagesOfCoinInPortfolio = (
  asset: any,
  allSum: number,
  isUSDCurrently: boolean
): number =>
  isUSDCurrently
    ? Number(asset.asset.priceUSD * asset.quantity * 100 / allSum)
    : Number(asset.asset.priceBTC * asset.quantity * 100 / allSum)

export const onSortTableFull = (
  key,
  tableData,
  currentSort,
  arrayOfStringHeadings,
  arrayOfDateHeadings?
) => {
  if (!tableData) {
    return
  }

  const stringKey = arrayOfStringHeadings.some((heading) => heading === key)
  const dateKey = arrayOfDateHeadings
    ? arrayOfDateHeadings.some((heading) => heading === key)
    : false

  let newCurrentSort: { key: string; arg: 'ASC' | 'DESC' } | null

  const newData = tableData.slice().sort((a, b) => {
    if (currentSort && currentSort.key === key) {
      if (currentSort.arg === 'ASC') {
        newCurrentSort = { key, arg: 'DESC' }

        if (stringKey) {
          return onSortStrings(b[key], a[key])
        }

        if (dateKey) {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime()
        }

        return b[key] - a[key]
      } else {
        newCurrentSort = { key, arg: 'ASC' }

        if (stringKey) {
          return onSortStrings(a[key], b[key])
        }

        if (dateKey) {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime()
        }

        return a[key] - b[key]
      }
    }

    newCurrentSort = { key, arg: 'ASC' }

    if (stringKey) {
      return onSortStrings(a[key], b[key])
    }

    if (dateKey) {
      return new Date(a[key]).getTime() - new Date(b[key]).getTime()
    }

    return a[key] - b[key]
  })

  console.log('dateKey: ', dateKey)
  console.log(newData)
  console.log(newCurrentSort)
  console.log('stringKey: ', stringKey)

  return {
    newData,
    newCurrentSort,
  }
}

export const getArrayContainsOnlyOnePropertyType = (
  arrayOfObjects: object,
  prop
) =>
  arrayOfObjects.reduce((result, element) => {
    result.push(element[prop])

    return result
  }, [])

export const combineDataToSelect = (arrayOfOneType: object) =>
  arrayOfOneType.map((elem) =>
    ({
      value: elem,
      label: elem,
    }))

export const cloneArrayElementsOneLevelDeep = (arrayOfObjects: object) =>
  arrayOfObjects.map((a) => Object.assign({}, a))

export const onSortStrings = (a: string, b: string): number =>
  a.localeCompare(b)

export const roundPercentage = (num: number) => num.toFixed(2)

// formatNumberToUSFormat - this function takes number or string, then it converts it to string anyway, and then decide
// — if our number has dot "." (is it number with fractional part or not) and then place commas by one of two regexes,
// depending on is our number has float part or not, and return us-formatted number (e.g. 1,000 etc.)

export const formatNumberToUSFormat = (numberToFormat: number | string) => {
  const stringNumber = numberToFormat.toString()

  return stringNumber.match(/\./g) ? stringNumber.replace(/\d(?=(\d{3})+\.)/g, '$&,') :
    stringNumber.replace(/\d(?=(\d{3})+$)/g, '$&,')
}

export const checkForString = (numberOrString: number | string) => typeof numberOrString === 'string'

export const roundAndFormatNumber = (x: number, numberOfDigitsAfterPoint: number) => {

  if (x === 0 || +x.toFixed(numberOfDigitsAfterPoint) === 0) {
    return '0'
  }

  return formatNumberToUSFormat(x.toFixed(numberOfDigitsAfterPoint))
}


// TODO: SHOULD BE REFACTORED
export const onValidateSum = (
  reducedSum: RowT,
  selectedBalances: RowT,
  tableData: RowT,
  isUSDCurrently: boolean
) => {
  // const { selectedBalances, tableData, isUSDCurrently } = this.state
  if (!selectedBalances || !tableData) { return null }
  const clonedSum = { ...reducedSum }

  const mainSymbol = isUSDCurrently ? (
    <Icon className="fa fa-usd" key="usd" />
  ) : (
      <Icon className="fa fa-btc" key="btc" />
    )

  if (selectedBalances.length === tableData.length) {
    clonedSum.currency = 'Total'
    clonedSum.symbol = '-'
    clonedSum.percentage = 100
  } else if (selectedBalances.length > 1) {
    clonedSum.currency = 'Selected'
    clonedSum.symbol = '-'
  }
  clonedSum.percentage = `${roundPercentage(clonedSum.percentage)}%`
  clonedSum.currentPrice = [mainSymbol, clonedSum.currentPrice]
  clonedSum.realizedPL = [mainSymbol, clonedSum.realizedPL]
  clonedSum.unrealizedPL = [mainSymbol, clonedSum.unrealizedPL]
  clonedSum.totalPL = [mainSymbol, clonedSum.totalPL]

  return clonedSum
}
