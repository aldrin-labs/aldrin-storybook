import { IExchange } from '@core/types/ChartTypes'
import { Theme } from '@material-ui/core'

export interface IProps {
  changeActiveExchangeMutation: ({
    variables: exchange,
  }: {
    variables: { exchange: IExchange }
  }) => Promise<any>
  activeExchange: IExchange
  currencyPair: string
  theme: Theme
}
