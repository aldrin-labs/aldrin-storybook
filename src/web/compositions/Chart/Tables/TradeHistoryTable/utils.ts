import { adaptSymbolToCCAIFormat  } from '@core/utils/symbolAdapter'


export const combineTradeHistoryDataFromWebsocket = (message: MessageEvent<any>, updateData: (a: any) => void): void => {
    const data = JSON.parse(message.data)

    if (data.e === 'aggTrade') {
        const symbol = adaptSymbolToCCAIFormat(data.s);
        const price = data.p;
        const quantity = data.q;
        const eventid = data.t;
        const tickerTimestamp = Math.round(data.E / 1000);
        const captureTimestamp = new Date().toISOString();
        const isBuyer = data.m ? 1 : 0


        updateData([{ symbol, price, size: quantity, timestamp: tickerTimestamp, fall: isBuyer }])

        // id
        // pair
        // exchange
        // size
        // marketType
        // price
        // time
        // fall
        // timestamp

        // return [0, symbol, 0, 'binance', price, quantity, eventid, tickerTimestamp, captureTimestamp, isBuyer]
    }

    return

}