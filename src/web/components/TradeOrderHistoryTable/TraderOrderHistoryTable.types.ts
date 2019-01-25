export type ITradeOrderHistoryTableData = {
  coin: string
  cost: number
  date: string
  id: string
  type: string
  where: string
}

export type ITradeOrderHistoryTableHeading = {
  isNumber: boolean
  id: string
  label: string
}

export interface IProps {
  rows: {
    body: ITradeOrderHistoryTableData[]
    head: ITradeOrderHistoryTableHeading[]
  }
}
