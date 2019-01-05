export interface HeatMapItem {
  x: number
  y: number
  color?: string | number
}

export interface Props {
  data: HeatMapItem[]
  width?: number
  height?: number
}
