import { Theme } from '@material-ui/core'

export interface IValue {
  x: string
  y: string
}
export interface IState {
  value: IValue | { x: null; y: null }
}

export type Data = { x: number; y: number }

export interface IProps {
  theme: Theme
  showBlurOnSections?: boolean
  data: {
    risk: string[]
    percentages: number[]
    activeButton: number
  }
}
