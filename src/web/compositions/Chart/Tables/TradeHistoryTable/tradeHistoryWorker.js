export default () => {
  let data = []

  const reduceArrayLength = (arr, maxArrayLengh = 60, elementsToDelete = 10) => {
    if (arr.length > maxArrayLengh) {
      arr.length = arr.length - elementsToDelete
    }

    return arr
  }

  const ccaiToBinanceMap = {
    BCH: 'BCH',
  };
  
  const binanceToCcaiMap = Object.keys(ccaiToBinanceMap).reduce((acc, cur) => {
    acc[ccaiToBinanceMap[cur]] = cur;
    return acc;
  }, {});

  const adapt = (symbol, adapterMap) => {
    const ccaiSymbol = adapterMap[symbol];
    return `${ccaiSymbol || symbol}`;
  };

  const adaptTickerSymbolToCCAIFormat = (symbol) => {
    const delimiter = symbol.includes('/') ? '/' : ''
    if (delimiter === '') {
      const regexp = /(.*)(BTC|ETH|USDT|BNB|XRP|PAX|USDC|TUSD|BUSD|USDS|USDS|NGN|RUB|TRY|EUR|ZAR|BKRW|TRX|IDRT|GBP|BIDR|UAH|DAI|AUD|BRL)/;
      const [full, base, quote] = regexp.exec(symbol);
      if (!quote || !base) {
        console.log('cant parse market', symbol);
        return;
      }
      const pair = `${adapt(base, binanceToCcaiMap)}_${adapt(quote, binanceToCcaiMap)}`;
      return pair
    } else {
      const [base, quote] = symbol.split(delimiter);
      if (!quote || !base) {
        console.log('cant parse market', symbol);
        return;
      }
      const pair = `${adapt(base, binanceToCcaiMap)}_${adapt(quote, binanceToCcaiMap)}`;
      return pair
    }
  }

  const combineTradeHistoryDataFromWebsocket = (msg) => {
    const data = JSON.parse(msg.data)

    if (data.e === 'aggTrade') {
      const symbol = adaptTickerSymbolToCCAIFormat(data.s)
      const price = data.p
      const quantity = data.q
      const eventid = data.t
      const tickerTimestamp = Math.round(data.E / 1000)
      const isBuyer = data.m ? 1 : 0
      const processedData = [
        {
          symbol,
          price,
          size: quantity,
          timestamp: tickerTimestamp,
          fall: isBuyer,
          eventid,
          marketType: 1,
        },
      ]
      return processedData
    }
    return []
  }

  

  const startSocket = () => {
    const socket = new WebSocket(
      'wss://fstream.binance.com/ws/btcusdt@aggTrade'
    )
    socket.onopen = () => {
        console.log(`Binance websoket opened connection for`) // eslint-disable-line
    }

    socket.onmessage = (msg) => {
      const tickersData = combineTradeHistoryDataFromWebsocket(msg)
      const updatedData = reduceArrayLength(tickersData.concat(data), 40)
      
      data = updatedData
      postMessage(data);
    }

    socket.onclose = () => {
      console.log(`Binance websoket ONCLOSE stream:`) // eslint-disable-line
    }

    socket.onerror = (err) => {
      console.log(`Binance websoket - ERROR for :`, err) // eslint-disable-line
    }
  }

  startSocket()

  self.addEventListener('message', (e) => {
    console.log('workerdata', e)
    postMessage('postedmessage')
  })
}
