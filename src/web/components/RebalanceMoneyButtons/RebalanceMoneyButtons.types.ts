import { IRow } from '@core/types/PortfolioTypes'

export interface IProps {
  isEditModeEnabled: boolean
  addMoneyInputValue: number | string
  undistributedMoney: string
  rows: IRow[]
  staticRows: IRow[]
  selectedActive: number[] | null
  updateState: Function
}
