import { Theme } from '@material-ui/core'

export interface PiePiece {
  angle: number
  label: string
  opacity?: number
  color?: string | number
  style?: object
}

export interface Props {
  data: PiePiece[]
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
  data: PiePiece[]
  value: PiePiece | null
}
