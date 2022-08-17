export const updateTerminalPriceQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenTerminalPrice

  if (isEmptySubscription) {
    return previous
  }

  const isPrevPriceEqualWithNewPrice =
    +previous.getPrice === +subscriptionData.data.listenTerminalPrice

  if (isPrevPriceEqualWithNewPrice) {
    return previous
  }

  const prev = JSON.parse(JSON.stringify(previous))
  const updatedPrice = subscriptionData.data.listenTerminalPrice

  prev.getPrice = updatedPrice

  return prev
}

export const getPriceForMarketOrderBasedOnOrderbook = (
  orderAmount: number,
  byType: 'sell' | 'buy',
  orderbook: { asks: number[][]; bids: number[][] }
) => {
  const arrayOfOrdersInOrderbook =
    byType === 'sell' ? orderbook.bids : orderbook.asks
  let priceForOrder =
    arrayOfOrdersInOrderbook[arrayOfOrdersInOrderbook.length - 1][0]
  const EXPECTED_REACHED_LIMIT = 5
  let alreadyReachedVolumeLimit = 0

  for (const order of arrayOfOrdersInOrderbook) {
    if (orderAmount <= order[1]) {
      // we need this check bcz sometimes the price in orderbook might go down,
      // and in this case the order will be not market but limit, to preven this we have EXPECTED_REACHED_LIMIT
      // in other words we just skipping some asks/bids in orderbook
      if (alreadyReachedVolumeLimit < EXPECTED_REACHED_LIMIT) {
        alreadyReachedVolumeLimit++
        continue
      }

      priceForOrder = order[0]
      break
    }
  }

  return priceForOrder
}
