import { WithTheme } from '@material-ui/core'

export interface IProps extends WithTheme {
  data: any
  isFullscreenEnabled: boolean
  colors: ReadonlyArray<string>
}
export interface IState {
  activeColumn: number | null
  activeRow: number | null
}

export interface IGridTableProps {
  isFullscreenEnabled: boolean
  rows: number
  columns: number
}

export interface ICellContentProps {
  color?: string
  activeBorderColor?: string
  mainBorderColor?: string
  active?: boolean
}

export interface ICellProps {
  isFullscreenEnabled?: boolean
  cols?: number
  textColor?: string
  fontFamily?: string | undefined
}
