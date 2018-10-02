import { IOrder } from '@containers/Chart/CommonTypes.types'

export const findSpread = (asks: any[], bids: any[]): number | null =>
  asks[asks.length - 1] && bids[0]
    ? +asks[asks.length - 1].price - +bids[0].price
    : 0

export const maximumItemsInArray = (
  data: any[],
  count: number,
  removeLast: number,
  removeFromStart: boolean = false
) => {
  if (data.length > count) {
    return removeFromStart
      ? data.slice(data.length - removeLast, data.length - 1)
      : data.slice(0, data.length - removeLast - 1)
  }

  return data
}

export const getNumberOfDigitsAfterDecimal = (
  orders: any[],
  column: 'size' | 'price'
) => {
  let numberOfDigitsAfterDecimal = 4
  for (const order of orders) {
    if (+order[column] > 1) {
      numberOfDigitsAfterDecimal = 4
    } else {
      numberOfDigitsAfterDecimal = 8

      break
    }
  }

  return numberOfDigitsAfterDecimal
}

export const calculatePercentagesOfOrderSize = (
  size: number,
  bids: any[]
): number =>
  Math.ceil(
    (+Number(size).toFixed(8) /
      bids.map((order) => +order.size).reduce((a, b) => a + b, 0)) *
      100
  )
// returns true if argument is JSON
export const testJSON = (text: any): boolean => {
  if (typeof text !== 'string') {
    return false
  }
  try {
    JSON.parse(text)

    return true
  } catch (error) {
    return false
  }
}

//  must delete bids that has price more then last ask
export const bidsPriceFiltering = (asks: IOrder[], bids: IOrder[]) =>
  bids.filter(
    (bid) =>
      bid &&
      +bid.price < +asks[asks.length - 1].price &&
      +asks[asks.length - 1].price
  )

export const sortAndFilterOrders = (orders: any[]) =>
  orders
    .slice()
    .sort((a, b) => (+a.price < +b.price ? 1 : +a.price > +b.price ? -1 : 0))
    .filter((order) => {
      // removing  orders with 0 size
      if (+order.size !== 0) {
        return order
      }
    })
export const ScrollToBottom = (objDiv: HTMLElement | null): null => {
  //  scroll down to bottom of asks table if user dont scrolled a lil bit up
  if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
}
