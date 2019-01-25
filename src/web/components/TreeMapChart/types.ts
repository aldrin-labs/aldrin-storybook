export interface Props {}

export interface TreeMapDataItem {
  title: string
  color: string
  size: number | undefined
}

export interface State {
  hoveredNode: JSX.Element | boolean
  treemapData: {
    title: string
    color: string
    children: {
      title: string
      children: {
        title: string
        color: string
        size: number
      }[]
    }[]
  }
}
