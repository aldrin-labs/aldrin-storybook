export interface IData {
  coin: string
  percentage: number | string
}

export interface IProps {
  withInput: boolean
  onClickDeleteIcon?: Function
  onPlusClick?: Function
  data: IData[]
  optimizedData: IData[]
}
export interface IState {
  name: string
  value: string | null
}
