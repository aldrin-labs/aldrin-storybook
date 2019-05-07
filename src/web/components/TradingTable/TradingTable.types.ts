import { Key } from '@core/types/ChartTypes'

export interface IProps {
  showCancelResult: ({ status, message }: { status: string, message: string }) => void
  getSelectedKeyQuery: { chart: { selectedKey: Key }}
}

export interface IState {
  tab: string
  tabIndex: number
}
