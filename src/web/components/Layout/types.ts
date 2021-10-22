export interface RowProps {
  wrap?: string
  justify?: string
  direction?: string
  align?: string
  width?: string
  height?: string
  margin?: string
  padding?: string
}

export interface CellProps {
  col?: number
  colSm?: number
  colMd?: number
  colLg?: number
  colXl?: number
}

export interface StretchedBlockProps {
  align?: string
  direction?: 'row' | 'column'
  width?: string
}
