export interface IProps {
  data: any
  isFullscreenEnabled: boolean
  colors: string[]
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
  active?: boolean 
}

export interface ICellProps { 
  isFullscreenEnabled?: boolean
  cols?: number
  textColor?: string
}