import { Theme } from '@material-ui/core'

export interface DonutPiece {
  angle: number
  label: string
  realValue: number
  gradientIndex: number
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
  width?: number
  height?: number
  radius?: number
  innerRadius?: number
  flexible?: boolean
  withHints?: boolean
  showLabels?: boolean
  labelsRadiusMultiplier?: number
  labelsStyle?: object
  colorLegend?: boolean
  theme: Theme
}

export interface State {
  data: DonutPiece[]
  value: DonutPiece | null
}
