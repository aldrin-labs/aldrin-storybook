export interface Items {
  title: string
  color: string
}

export interface IValue {
  x: string
  y: string
}
export interface IChart {
  title: string
  color: string
  data: IValue[]
}

export interface IProps {
  charts: IChart[]
  showPlaceholder?: boolean
  height?: number
  alwaysShowLegend?: boolean
  animated?: boolean
}
export interface IState {
  value: IValue | { x: null; y: null }
}
