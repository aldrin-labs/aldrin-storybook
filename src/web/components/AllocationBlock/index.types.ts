import { Theme } from '@material-ui/core'

type TokenData = {
  symbol: string
  value: number // percentage
  id: string
}

type IProps = {
  data: TokenData[]
  theme: Theme
  id?: string
  colors: string[]
  colorsForLegend: string[]
}

export { IProps }
