import { Theme } from '@material-ui/core'

export interface IProps {
  data: any
  isFullscreenEnabled: boolean
  fullScreenChangeHandler: Function
  setCorrelationPeriod: Function
  period: string
  dates: { startDate: number; endDate: number }
  CustomColors?: string[]
  theme: Theme
}
