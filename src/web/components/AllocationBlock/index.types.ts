
type TokenData = {
  symbol: string
  value: number // percentage
  id: string
}

type IProps = {
  data: TokenData[]
  id: string
  colors: string[]
  colorsForLegend: string[]
}

export { IProps }
