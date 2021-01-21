export default () => {
  function TreeMap() {
    var root = null
    var keyType = void 0
    var length = 0

    return {
      each: each,
      set: set,
      get: get,
      getTree: getTree,
      getLength: getLength,
      getMaxKey: getMaxKey,
      getMinKey: getMinKey,
      remove: remove,
    }

    function checkKey(key, checkKeyType) {
      var localKeyType = typeof key

      if (
        localKeyType !== 'number' &&
        localKeyType !== 'string' &&
        localKeyType !== 'boolean'
      ) {
        throw new Error("'key' must be a number, a string or a boolean")
      }

      if (checkKeyType === true && localKeyType !== keyType) {
        throw new Error('All keys must be of the same type')
      }

      return localKeyType
    }

    function call(callback) {
      var args = Array.prototype.slice.call(arguments, 1)

      if (typeof callback === 'function') {
        callback.apply(void 0, args)
      }
    }

    function getTree() {
      return root
    }

    function getLength() {
      return length
    }

    function each(callback) {
      internalEach(root, callback)
    }

    function internalEach(node, callback, internalCallback) {
      if (node === null) {
        return call(internalCallback)
      }

      internalEach(node.left, callback, function() {
        call(callback, node.value, node.key)

        internalEach(node.right, callback, function() {
          call(internalCallback)
        })
      })
    }

    function get(key) {
      checkKey(key)

      return internalGet(key, root)
    }

    function internalGet(key, node) {
      if (node === null) {
        return void 0
      }

      if (key < node.key) {
        return internalGet(key, node.left)
      } else if (key > node.key) {
        return internalGet(key, node.right)
      } else {
        return node.value
      }
    }

    function set(key, value) {
      if (root === null) {
        keyType = checkKey(key)
      } else {
        checkKey(key, true)
      }

      root = internalSet(key, value, root)
    }

    function internalSet(key, value, node) {
      if (node === null) {
        length++

        return {
          key: key,
          value: value,
          left: null,
          right: null,
        }
      }

      if (key < node.key) {
        node.left = internalSet(key, value, node.left)
      } else if (key > node.key) {
        node.right = internalSet(key, value, node.right)
      } else {
        node.value = value
      }

      return node
    }

    function getMaxKey() {
      var maxNode = getMaxNode(root)

      if (maxNode !== null) {
        return maxNode.key
      }

      return maxNode
    }

    function getMinKey() {
      var minNode = getMinNode(root)

      if (minNode !== null) {
        return minNode.key
      }

      return minNode
    }

    function getMaxNode(node) {
      while (node !== null && node.right !== null) {
        node = node.right
      }

      return node
    }

    function getMinNode(node) {
      while (node !== null && node.left !== null) {
        node = node.left
      }

      return node
    }

    function remove(key) {
      checkKey(key)

      root = internalRemove(key, root)
    }

    function internalRemove(key, node) {
      if (node === null) {
        return null
      }

      if (key < node.key) {
        node.left = internalRemove(key, node.left)
      } else if (key > node.key) {
        node.right = internalRemove(key, node.right)
      } else {
        if (node.left !== null && node.right !== null) {
          var maxNode = getMaxNode(node.left)

          var maxNodeKey = maxNode.key
          var maxNodeValue = maxNode.value

          maxNode.key = node.key
          maxNode.value = node.value
          node.key = maxNodeKey
          node.value = maxNodeValue

          node.left = internalRemove(key, node.left)
        } else if (node.left !== null) {
          length--
          return node.left
        } else if (node.right !== null) {
          length--
          return node.right
        } else {
          length--
          return null
        }
      }

      return node
    }
  }

  let state = {
    asks: new TreeMap(),
    bids: new TreeMap(),
    aggregatedData: {
      asks: new TreeMap(),
      bids: new TreeMap(),
    }
  }

  const getNumberOfDecimalsFromNumber = (number) => {
    return number.toString().split('.')[1].length
  }

  const getAggregationsFromMinPriceDigits = (minPriceDigits) => {
    if (minPriceDigits >= 0.01) {
      return [
        {
          label: 0.01,
          value: 0.01,
        },
        {
          label: 0.1,
          value: 0.1,
        },
        {
          label: 1,
          value: 1,
        },
        {
          label: 10,
          value: 10,
        },
        // {
        //   label: 100,
        //   value: 100,
        // },
      ]
    } else if (minPriceDigits >= 0.001) {
      return [
        {
          label: 0.001,
          value: 0.001,
        },
        {
          label: 0.01,
          value: 0.01,
        },
        {
          label: 0.1,
          value: 0.1,
        },
        {
          label: 1,
          value: 1,
        },
        {
          label: 10,
          value: 10,
        },
      ]
    } else if (minPriceDigits >= 0.0001) {
      return [
        {
          label: '4 decimal',
          value: 0.0001,
        },
        {
          label: '3 decimal',
          value: 0.001,
        },
        {
          label: '2 decimal',
          value: 0.01,
        },
        {
          label: '1 decimal',
          value: 0.1,
        },
        {
          label: '0 decimal',
          value: 1,
        },
      ]
    } else if (minPriceDigits >= 0.00001) {
      return [
        {
          label: '5 decimal',
          value: 0.00001,
        },
        {
          label: '4 decimal',
          value: 0.0001,
        },
        {
          label: '3 decimal',
          value: 0.001,
        },
        {
          label: '2 decimal',
          value: 0.01,
        },
      ]
    } else if (minPriceDigits >= 0.000001) {
      return [
        {
          label: '6 decimal',
          value: 0.000001,
        },
        {
          label: '5 decimal',
          value: 0.00001,
        },
        {
          label: '4 decimal',
          value: 0.0001,
        },
        {
          label: '3 decimal',
          value: 0.001,
        },
        {
          label: '2 decimal',
          value: 0.01,
        },
      ]
    } else {
      return [
        {
          label: '8 decimal',
          value: '0.00000001',
        },
        {
          label: '7 decimal',
          value: '0.0000001',
        },
        {
          label: '6 decimal',
          value: 0.000001,
        },
      ]
    }
  }

  const deleteOldData = ({ data, isAggregatedData }) => {
    const { asks, bids } = data
    let count = 0

    while (
      (isAggregatedData
        ? true
        : asks.getLength() > 20 && bids.getLength() > 20) &&
      count < 20
    ) {
      if (+asks.getMinKey() > +asks.getMaxKey()) {
        asks.remove(asks.getMinKey())
      }

      if (
        asks.getMinKey() !== null &&
        bids.getMaxKey() !== null &&
        asks.get(asks.getMinKey())[3] < bids.get(bids.getMaxKey())[3]
      ) {
        while (+asks.getMinKey() <= +bids.getMaxKey() && asks.getMinKey()) {
          asks.remove(asks.getMinKey())
        }
      }

      if (
        asks.getMinKey() !== null &&
        bids.getMaxKey() !== null &&
        asks.get(asks.getMinKey())[3] > bids.get(bids.getMaxKey())[3]
      ) {
        while (+bids.getMaxKey() >= +asks.getMinKey() && bids.getMaxKey()) {
          bids.remove(bids.getMaxKey())
        }
      }

      count++
    }
  }

  const functionToRound = (side, aggregation) =>
    aggregation >= 1
      ? side === 'asks'
        ? roundUp
        : roundDown
      : side === 'asks'
      ? roundUpSmall
      : roundDownSmall

  const addOrderToOrderbook = ({
    updatedData,
    orderData,
    aggregation,
    defaultAggregation = 8,
    originalOrderbookTree,
    isAggregatedData = false,
    sizeDigits = 8,
    side,
    digitsByGroup,
  }) => {
    if (aggregation === 0) return updatedData

    const { price, size, timestamp } = orderData[side][0]

    // func to round price depend on aggregation
    const orderPrice = functionToRound(side, aggregation)(price, digitsByGroup)
    const orderSize = Number(size)
    const orderTotal = Number(roundUpSmall(Number(price) * orderSize, 2))
    const existOrderData = updatedData[side].get(+orderPrice)

    // delete if > 300 orders in state
    if (updatedData[side].getLength() >= 300) {
      side === 'asks'
        ? updatedData[side].remove(updatedData[side].getMaxKey())
        : updatedData[side].remove(updatedData[side].getMinKey())
    }

    // if receive order with zero amount => delete this order, otherwise add to orderbook
    if (Number(orderSize) === 0) {
      if (isAggregatedData) {
        // we get current amount in orig. tree and minus it from data in aggregated
        const orderData = originalOrderbookTree[side].get(
          +roundUpSmall(price, defaultAggregation)
        )
        // receive amount from aggregated

        if (orderData && existOrderData) {
          const newData = [
            orderPrice,
            +(+existOrderData[1] - +orderData[1]).toFixed(sizeDigits),
            +(+existOrderData[2] - +orderData[2]).toFixed(2),
            Number(timestamp),
          ]

          // we delete node if new amount < 0
          if (+newData[1] <= 0 || +newData[2] <= 0) {
            updatedData[side].remove(+orderPrice)
          } else {
            updatedData[side].set(+orderPrice, newData)
          }
        }
      } else if (updatedData[side].getLength() > 20) {
        // just delete node from tree if data isn't aggregated
        updatedData[side].remove(+orderPrice)
      }
    } else if (isAggregatedData && existOrderData) {
      // add amount if aggregated
      if (existOrderData !== undefined) {
        const [_, currentSize, currentTotal] = existOrderData

        updatedData[side].set(+orderPrice, [
          orderPrice,
          Number(+currentSize + orderSize).toFixed(sizeDigits),
          roundUpSmall(+currentTotal + orderTotal, 2),
          Number(timestamp),
        ])
      }
    } else if (updatedData[side]) {
      // create new one node
      updatedData[side].set(+orderPrice, [
        orderPrice,
        Number(orderSize).toFixed(sizeDigits),
        roundUpSmall(orderSize * price, 2),
        Number(timestamp),
      ])
    }

    // here we delete nodes if min asks > max bid and vice versa
    deleteOldData({
      data: updatedData,
      isAggregatedData,
    })

    return updatedData
  }

  const addOrdersToOrderbook = ({
    updatedData,
    ordersData,
    aggregation,
    originalOrderbookTree,
    isAggregatedData = false,
    sizeDigits,
    defaultAggregation = 8,
  }) => {
    let dataWithNewOrders = updatedData
    const { asks, bids } = ordersData
    const maxLength = Math.max(asks.length, bids.length)

    const digitsByGroup =
      aggregation >= 1
        ? aggregation
        : getNumberOfDecimalsFromNumber(aggregation)

    for (let i = 0; i <= maxLength - 1; i++) {
      if (asks.length > i) {
        dataWithNewOrders = addOrderToOrderbook({
          updatedData: dataWithNewOrders,
          orderData: { asks: [asks[i]], bids: [] },
          aggregation,
          originalOrderbookTree,
          isAggregatedData,
          sizeDigits,
          side: 'asks',
          digitsByGroup,
          defaultAggregation,
        })
      }

      if (bids.length > i) {
        dataWithNewOrders = addOrderToOrderbook({
          updatedData: dataWithNewOrders,
          orderData: { asks: [], bids: [bids[i]] },
          aggregation,
          originalOrderbookTree,
          isAggregatedData,
          sizeDigits,
          side: 'bids',
          digitsByGroup,
          defaultAggregation,
        })
      }
    }

    return dataWithNewOrders
  }

  // for .01, .1 group
  const roundUpSmall = (value, roundTo) => {
    return (+value).toFixed(roundTo)
  }

  const roundDownSmall = (value, roundTo) => {
    return (
      Math.floor(value * Math.pow(10, roundTo)) / Math.pow(10, roundTo)
    ).toFixed(roundTo)
  }

  // for 1, 10, 100 group
  const roundUp = (value, roundTo) => {
    return String(Math.ceil(+value / roundTo) * roundTo)
  }

  const roundDown = (value, roundTo) => {
    return String(Math.floor(+value / roundTo) * roundTo)
  }

  const travers = (node, resultData) => {
    if (node.left) travers(node.left, resultData)

    resultData.push({
      price: node.value[0],
      size: node.value[1],
      total: node.value[2],
      timestamp: node.value[3],
    })

    if (node.right) travers(node.right, resultData)
    return resultData
  }

  const sortAsc = (orders) => orders.sort(({ price: priceA }, { price: priceB }) => priceA - priceB)

  const getDataFromTree = (tree, table) => {
    if (table === 'asks') {
      if (!tree.getTree()) return []
  
      const sortedData = travers(tree.getTree(), [])
      const limitedData = sortedData.slice(0, 30)
  
      return sortAsc(limitedData)
    } else {
      if (!tree.getTree()) return []
  
      const updatedBids = travers(tree.getTree(), [])
  
      const limitedData = updatedBids.slice(
        updatedBids.length > 30 && updatedBids.length - 30
      )
  
      return sortAsc(limitedData)
    }
  }

  self.addEventListener('message', (e) => {
    // eslint-disable-line no-restricted-globals
    // console.log('e in worker', e)
    const {
      aggregation,
      sizeDigits,
      minPriceDigits,
      data,
      aggregatedData,
    } = e.data
    let updatedData = null
    let updatedAggregatedData = aggregatedData

    let ordersAsks = data.marketOrders.asks
    let ordersBids = data.marketOrders.bids

    const marketOrders = Object.assign(
      {
        asks: [],
        bids: [],
        __typename: 'orderbookOrder',
      },
      {
        asks: ordersAsks,
        bids: ordersBids,
      }
    )

    if (
      ((marketOrders.asks.length > 0 || marketOrders.bids.length > 0) &&
        !(typeof marketOrders.asks === 'string')) ||
      !(typeof marketOrders.bids === 'string')
    ) {
      const ordersData = marketOrders
      const originalOrderbookTree = { asks: state.asks, bids: state.bids }
      const orderbookData = updatedData || originalOrderbookTree

      if (
        String(aggregation) !==
        String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
      ) {
        updatedAggregatedData = addOrdersToOrderbook({
          updatedData: updatedAggregatedData,
          ordersData,
          aggregation,
          defaultAggregation: getAggregationsFromMinPriceDigits(
            minPriceDigits
          )[0].value,
          originalOrderbookTree,
          isAggregatedData: true,
          sizeDigits,
        })
      }

      updatedData = addOrdersToOrderbook({
        updatedData: orderbookData,
        ordersData,
        aggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0].value,
        defaultAggregation: getAggregationsFromMinPriceDigits(minPriceDigits)[0]
          .value,
        originalOrderbookTree,
        isAggregatedData: false,
        sizeDigits,
      })
    }

    const result = {
      aggregatedData: updatedAggregatedData,
      ...updatedData,
    }

    state = result

    const dataToSend =
      String(aggregation) ===
      String(getAggregationsFromMinPriceDigits(minPriceDigits)[0].value)
        ? { asks: getDataFromTree(state.asks, 'asks').reverse(), bids: getDataFromTree(state.bids, 'bids').reverse(), isAggregatedData: false }
        : { asks: getDataFromTree(state.aggregatedData.asks, 'asks').reverse(), bids: getDataFromTree(state.aggregatedData.bids, 'bids').reverse(), isAggregatedData: true }


    postMessage(JSON.parse(JSON.stringify(dataToSend)))
  })
}
