import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'

export const removeEditableModeInCoins = (rows: IRow[]) =>
  rows.map((el: IRow) => {
    if (el.editable) {
      return {
        ...el,
        editable: false,
      }
    }

    return el
  })

export const calculatePriceByPercents = (
  data: IRow[],
  totalRows: number | string
) => {
  const dataWithNewPrices = data.map((row: IRow) => {
    let newPrice = ((parseFloat(totalRows) / 100) * +row.portfolioPerc).toFixed(
      2
    )

    return {
      ...row,
      price: newPrice,
    }
  })

  return dataWithNewPrices
}

export const calculateTotal = (data: IRow[], undistributedMoney: string) => {
  // tslint:disable-next-line no-parameter-reassignment
  const total = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

  return (total + parseFloat(undistributedMoney)).toFixed(2)
}

export const calculateTableTotal = (data: IRow[]) => {
  const tableTotal = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

  return tableTotal.toFixed(2)
}

export const calculateTotalPercents = (data: IRow[]) => {
  const totalPercents = data
    .reduce((sum, row) => (sum += +row!.portfolioPerc), 0)
    .toFixed(3)

  return totalPercents
}

export const checkPercentSum = (data: IRow[]) => {
  const sumOfAllPercents = data.reduce(
    (sum, row) => (sum += +row!.portfolioPerc),
    0
  )

  return Math.abs(sumOfAllPercents - 100) <= 0.001 || sumOfAllPercents === 0
}

export const calculatePriceDifference = (data: IRow[], staticRows: IRow[]) => {
  data.forEach((row, i) => {
    staticRows.forEach((staticRow, j) => {
      if (
        data[i].exchange === staticRows[j].exchange &&
        data[i].symbol === staticRows[j].symbol
      ) {
        // TODO: Refactor when we have much more time than now
        // tslint:disable-next-line no-object-mutation
        data[i].deltaPrice = (
          parseFloat(data[i].price) - parseFloat(staticRows[j].price)
        ).toFixed(2)
      }
    })
  })

  // console.log(
  //   'data.length > staticRows.length',
  //   data.length > staticRows.length
  // )

  if (data.length > staticRows.length) {
    const arrayOfNewCoinIndexes: number[] = data.reduce(
      (newCoinsIndexesArray: number[], el, i) => {
        if (
          !staticRows.some(
            (element) =>
              element.exchange === el.exchange && element.symbol === el.symbol
          )
        ) {
          return newCoinsIndexesArray.concat(i)
        }

        return newCoinsIndexesArray
      },
      []
    )

    data = data.map((row, i) => {
      if (arrayOfNewCoinIndexes.includes(i)) {
        return {
          ...row,
          deltaPrice: (parseFloat(row.price) - 0).toFixed(2),
        }
      }

      return row
    })
  }

  // console.log('data length', data.length)
  // console.log('staticRows length', staticRows.length)
  // console.log('data in caluclatePriceDiff', data)

  return data
}

export const calculatePercents = (
  data: IRow[],
  total: string,
  staticRows: IRow[]
) => {
  const newDataWithPercents = data.map((row) => {
    const percentCaluclation =
      +row.price === 0
        ? '0'
        : ((parseFloat(row.price) * 100) / parseFloat(total)).toFixed(4)
    const percentResult = +percentCaluclation === 0 ? '0' : percentCaluclation

    return {
      ...row,
      portfolioPerc: percentResult,
    }
  })
  // console.log('DATA IN CALCULATE PERCENTS: ', newDataWithPercents)

  return calculatePriceDifference(newDataWithPercents, staticRows)
}

export function calculateMoneyPart(
  money: number,
  numberOfCoinsThatMoneyWouldDistributed: number
): number[] {
  const divided = money / numberOfCoinsThatMoneyWouldDistributed
  const ifDividedRemainderHasMoreThan3Numbers =
    divided.toString().search(/\d+\.\d{3,}/) !== -1
  // console.log(ifDividedRemainderHasMoreThan3Numbers);

  const remainderWith2Number = Math.floor(divided * 100) / 100
  // const remainderLastNumbers = ((divided * 100) % 1 * numberOfCoinsThatMoneyWouldDistributed / 100)
  const remainderLastNumbers =
    money - remainderWith2Number * numberOfCoinsThatMoneyWouldDistributed

  // console.log('remainderLastNumbers', remainderLastNumbers);

  const array = new Array(numberOfCoinsThatMoneyWouldDistributed)
    .fill(undefined)
    .map((el, i) => {
      if (!ifDividedRemainderHasMoreThan3Numbers) {
        return divided
      }

      return i === numberOfCoinsThatMoneyWouldDistributed - 1
        ? +(remainderWith2Number + remainderLastNumbers).toFixed(2)
        : remainderWith2Number
    })

  return array
}
