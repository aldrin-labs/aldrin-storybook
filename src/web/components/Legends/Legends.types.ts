export interface Props {
  legends: {
    color: string
    title: string
  }[]
  onChange?: Function
}

export interface State {
  activeLegend: number | null
}
