import { Theme } from '@material-ui/core'

export interface DonutPiece {
  angle: number
  label: string
  realValue: number
  colorIndex: number
  opacity?: number
  color?: string | number
  style?: object
}

export interface InputRecord {
  label: string
  realValue: number
}

export interface Props {
  data: InputRecord[]
  labelPlaceholder: string
  colors: string[]
  theme: Theme
  colorLegend: boolean
  colorLegendWhidh: number
  thicknessCoefficient: number
}

export interface State {
  data: DonutPiece[]
  value: DonutPiece | null
  colorsWithRandom: string[]
  chartSize: number
  isEmpty: boolean
  sizeKey: number
}
