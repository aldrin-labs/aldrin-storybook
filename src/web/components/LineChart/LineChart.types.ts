export interface Serie {
  x: number
  y: number
  label: string
}

export interface Props {
  data: Serie[][] | undefined
  activeLine: number | null
  showCustomPlaceholder: boolean
  placeholderElement: any
  onChangeData?: Function
}

export interface State {
  crosshairValues: Serie[]
  deepLevel: number
}
