export interface IProps {
  classes: any
  transactionsData: {
    convertedFrom: string
    convertedTo: string
    sum: number
    isDone: boolean
  }
}
