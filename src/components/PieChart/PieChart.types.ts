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
  theme: Theme
}

export interface State {
  data: PiePiece[]
  value: PiePiece | null
}
