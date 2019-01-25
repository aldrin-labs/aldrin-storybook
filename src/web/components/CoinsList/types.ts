
export interface ICoinsTableCell {
  row: string
}

export interface ICoinsTableList {
  [key: string]: string
  tableRows: string
}

export type CoinLink = {
  assetId?: string
  name: string
}
