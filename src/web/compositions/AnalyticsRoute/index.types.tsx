import { Theme } from '@material-ui/core'

export type RowProps = {
  wrap?: string
  justify?: string
  direction?: string
  align?: string
  width?: string
  height?: string
  margin?: string
  padding?: string
}

export type TitleProps = {
  color?: string
  theme?: Theme
  fontSize?: string
  fontFamily?: string
}

export type LineProps = {
  top?: string
  bottom?: string
  background?: string
  theme: Theme
}

export interface IProps {
  theme: Theme
  publicKey: string
  selectedPair: string
  markets: { name: string; address: any }[]
  getSerumDataQuery: {
    getSerumData: {
      circulatingSupply: number
      totalySupply: number
      burned: number
    }
  }
}