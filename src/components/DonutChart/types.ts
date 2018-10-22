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

export interface gradient {
  [index: number]: string
}

export interface Props {
  data: InputRecord[]
  labelPlaceholder: string
  radius: number
  thickness?: number
  gradients: gradient[]
  theme: Theme
  colorLegend: boolean
  isSizeFlexible: boolean
  hightCoefficient: number
  widthCoefficient: number
  radiusCoefficient: number
}

export interface State {
  data: DonutPiece[]
  value: DonutPiece | null
}
