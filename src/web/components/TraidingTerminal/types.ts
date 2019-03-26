import { Theme } from '@material-ui/core'
import { FormikProps } from 'formik'

export interface FormValues {
  price: number | string
  stop: number | string
  limit: number | string
  amount: number | string
  total: number | string
}

export interface IProps {
  byType: 'buy' | 'sell'
  priceType: 'limit' | 'market' | 'stop-limit'
  pair: [string, string]
  marketPrice: number
  theme: Theme
  walletValue: number
  confirmOperation: (
    filtredValues: Partial<FormValues>) => null
}

export interface IPropsWithFormik extends FormikProps<FormValues>, IProps {}

