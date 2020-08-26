import { Theme } from '@material-ui/core'
import { FormikProps } from 'formik'
import { IResult } from '@core/types/ChartTypes'

export interface FormValues {
  price: number
  stop: number
  limit: number
  amount: number
  margin: number
  total: number
  reduceOnly: boolean
  leverage: number
  timeInForce?: string
  postOnly?: boolean
}

export type priceType = 'limit' | 'market' | 'stop-limit'

export interface IProps {
  byType: 'buy' | 'sell'
  priceType: priceType
  pair: [string, string]
  decimals: [number, number]
  leverage: number
  marketPrice: number
  theme: Theme
  marketPriceAfterPairChange: number
  priceFromOrderbook: number
  quantityPrecision: number
  isSPOTMarket: boolean
  walletValue: number
  confirmOperation: (
    byType: 'buy' | 'sell',
    priceType: 'limit' | 'market' | 'stop-limit',
    filtredValues: Partial<FormValues>,
    mode: string,
    state: any,
    futuresValues: any
  ) => IResult

  showOrderResult: (
    result: IResult,
    cancelOrderFunction: (arg: any) => void
  ) => null
}

export interface IPropsWithFormik extends FormikProps<FormValues>, IProps {}
