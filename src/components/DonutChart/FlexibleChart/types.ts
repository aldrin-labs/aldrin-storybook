export interface Props {
  data: InputRecord[]
  value: any
  colorsWithRandom: string[]
  thicknessCoefficient: number
  onValueMouseOver: (v: DonutPiece) => any
  onSeriesMouseOut: () => any
}

export interface InputRecord {
  label: string
  realValue: number
}

export interface State {
  chartRadius: number
  doReportSize: boolean
  elementRef: any
}

export interface DonutPiece {
  angle: number
  label: string
  realValue: number
  colorIndex: number
  opacity?: number
  color?: string | number
  style?: object
}
