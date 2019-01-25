export interface Props {
  rates: {
    name: string
    rate: number
  }[]
}

export interface State {
  currentRate: {
    name: string
    rate: number
  }
  firstValue: string
  secondValue: string
}
