export const updatePriceQuerryFunction = (previous, { subscriptionData }) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenPrice

  if (isEmptySubscription) {
    return previous
  }

  const isPrevPriceEqualWithNewPrice =
    +previous.getPrice === +subscriptionData.data.listenPrice

  if (isPrevPriceEqualWithNewPrice) {
    return previous
  }

  const prev = JSON.parse(JSON.stringify(previous))
  const updatedPrice = subscriptionData.data.listenPrice

  prev.getPrice = updatedPrice

  return prev
}

export const updateMarkPriceQuerryFunction = (
  previous,
  { subscriptionData }
) => {
  const isEmptySubscription =
    !subscriptionData.data || !subscriptionData.data.listenMarkPrice

  if (isEmptySubscription) {
    return previous
  }

  const isPrevPriceEqualWithNewPrice =
    +previous.getMarkPrice.markPrice ===
    +subscriptionData.data.listenMarkPrice.markPrice

  if (isPrevPriceEqualWithNewPrice) {
    return previous
  }

  const prev = JSON.parse(JSON.stringify(previous))
  const updatedPrice = subscriptionData.data.listenMarkPrice.markPrice

  prev.getMarkPrice.markPrice = updatedPrice

  return prev
}
