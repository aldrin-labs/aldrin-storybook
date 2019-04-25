import { Theme } from '@material-ui/core'
import { FormikProps } from 'formik'

export interface FormValues {
  price: number | string
  stop: number | string
  limit: number | string
  amount: number | string
  total: number | string
}

export type priceType = 'limit' | 'market' | 'stop-limit'

interface IResult {
  status: 'success' | 'error'
  message: string
  orderId?: string
}

export interface IProps {
  byType: 'buy' | 'sell'
  priceType: priceType
  pair: [string, string]
  decimals: [number, number]
  marketPrice: number
  theme: Theme
  walletValue: number
  confirmOperation: (
    byType: 'buy' | 'sell',
    priceType: 'limit' | 'market' | 'stop-limit',
    filtredValues: Partial<FormValues>) => IResult
  showOrderResult: (result: IResult) => null
}

export interface IPropsWithFormik extends FormikProps<FormValues>, IProps {}

