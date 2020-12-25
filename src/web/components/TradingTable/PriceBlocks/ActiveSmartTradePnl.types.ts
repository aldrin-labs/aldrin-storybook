import { Theme } from '@material-ui/core';

export interface IProps {
    theme: Theme;
    price: number;
    pair: [string, string]
    entryPrice: number
    leverage: number
    side: string
    positionAmt: number
}

export interface IPropsDataWrapper extends IProps {
    symbol: string;
    exchange: string;
    getMarkPriceQuery: any
  }

