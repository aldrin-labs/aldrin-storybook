import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'

export interface IProps {
  isEditModeEnabled: boolean
  addMoneyInputValue: number | string
  undistributedMoney: string
  rows: IRow[]
  staticRows: IRow[]
  selectedActive: number[] | null
  updateState: Function
}
