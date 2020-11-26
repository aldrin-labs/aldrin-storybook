// const { adaptPairToBinanceFormat } = require('');
import { adaptSymbolToExchangeFormat } from '@core/utils/symbolAdapter'

const tickerCollector = (pair, dbSaver) => {
  const urlPrefix = 'wss://stream.binance.com:9443/ws/';
  const urlPostfix = '@trade';
  const url = urlPrefix + adaptSymbolToExchangeFormat(pair).toLowerCase().replace('_', '') + urlPostfix;

  const socket = new WebSocket(url);

  socket.onmessage((message) => {
    const data = JSON.parse(message);
    const symbol = pair;
    const price = data.p;
    const quantity = data.q;
    const eventid = data.t;
    const tickerTimestamp = Math.round(data.E / 1000);
    const captureTimestamp = new Date().toISOString();
    const isBuyer = data.m ? 1 : 0


    dbSaver.saveTickers(
      [0, symbol, 0, 'binance', price, quantity, eventid, tickerTimestamp, captureTimestamp, isBuyer],
      `${data.t}`
    );
  });

  socket.onopen(() => {
       console.log(`Binance tickerCollector opened connection for ${pair}`); // eslint-disable-line
  });

  socket.onclose(() => {
    console.log(`Binance tickerCollector ONCLOSE stream: ${pair}`); // eslint-disable-line

    // console.log(`Binance tickerCollector reopening stream: ${pair}`); // eslint-disable-line

    // Recursive call of the function in case if we are disconnected from the socket
    // tickerCollector(pair, dbSaver);
  });

  socket.onerror((err) => {
    console.log(`Binance tickerCollector - ERROR for ${pair}: ${err}`); // eslint-disable-line
  });

};