export const transformOrderbookData = ({
  marketOrders,
}: {
  marketOrders: { asks: string; bids: string }
}) => {
  if (marketOrders) {
    const newDataAsks = JSON.parse(marketOrders.asks)
    const newDataBids = JSON.parse(marketOrders.bids)

    const asksData = newDataAsks.map((ask) => ({
      price: +(+ask[0]).toFixed(2),
      size: +ask[1][0],
      total: +ask[1][1],
    }))

    const bidsData = newDataBids.map((bid) => ({
      price: +(+bid[0]).toFixed(2),
      size: +bid[1][0],
      total: +bid[1][1],
    }))

    return { asks: asksData, bids: bidsData }
  }
  return { asks: [], bids: [] }
}
