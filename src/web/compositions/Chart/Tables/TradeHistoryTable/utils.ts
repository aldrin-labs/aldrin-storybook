import { adaptTickerSymbolToCCAIFormat } from '@core/utils/symbolAdapter'



export const combineTradeHistoryDataFromWebsocket = (message: MessageEvent<any>, updateData: (a: any) => void, marketType: 0 | 1): void => {
    const data = JSON.parse(message.data)

    if (data.e === 'aggTrade') {
        const symbol = adaptTickerSymbolToCCAIFormat(data.s);
        const price = data.p;
        const quantity = data.q;
        const eventid = data.t;
        const tickerTimestamp = Math.round(data.E / 1000);
        // const captureTimestamp = new Date().toISOString();
        const isBuyer = data.m ? 1 : 0

        updateData([{ symbol, price, size: quantity, timestamp: tickerTimestamp, fall: isBuyer, eventid, marketType }])
    }

    return

}

export const combineTradeHistoryDataFromFetch = (data: any): any => {


    const processedData = data.map(el => ({
        price: el.p,
        size: el.q,
        timestamp: Math.round(el.T / 1000),
        fall: el.m ? 1 : 0,
        eventid: el.a,
    }))

    return processedData

// spot

// M: true
// T: 1606246377474
// a: 434714317
// f: 480893164
// l: 480893164
// m: false
// p: "19258.87000000"
// q: "0.01870000"

// futures
// T: 1606246358268
// a: 184840765
// f: 284395309
// l: 284395309
// m: true
// p: "19285.90"
// q: "0.008"

}