import { Connection } from '@solana/web3.js';

// Create a cached API wrapper to avoid rate limits.
class PriceStore {
    public cache: {
        [cacheKey: string]: number;
    }
  
    constructor() {
      this.cache = {};
    }
  
    public getFromCache(marketName: string) {
      return this.cache[marketName]
    }
  
    public async getPrice(marketName: string): Promise<number | null> {
      return new Promise((resolve, reject) => {
        if (this.cache[marketName] === undefined) {
          let CORS_PROXY = "https://ancient-peak-37978.herokuapp.com/"
          fetch(`${CORS_PROXY}https://serum-api.bonfida.com/orderbooks/${marketName}`).then(
            (resp) => {
              resp.json().then((resp) => {
                if (!resp || !resp.data || !resp.data.asks || !resp.data.bids) {
                  resolve(null)
                  return
                }
  
                if (resp.data.asks.length === 0 && resp.data.bids.length === 0) {
                  resolve(null);
                } else if (resp.data.asks.length === 0) {
                  resolve(resp.data.bids[0].price);
                } else if (resp.data.bids.length === 0) {
                  resolve(resp.data.asks[0].price);
                } else {
                  const mid =
                    (resp.data.asks[0].price + resp.data.bids[0].price) / 2.0;
                  this.cache[marketName] = mid;
                  resolve(this.cache[marketName]);
                }
              });
            },
          ).catch(e => {
            resolve(null)
          });
        } else {
          return resolve(this.cache[marketName]);
        }
      });
    }
  }
  
  export const priceStore = new PriceStore();
  