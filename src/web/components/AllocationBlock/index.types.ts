import { Theme } from "@material-ui/core"

type TokenData = {
  symbol: string;
  value: number; // percentage
}

type IProps = {
  data: TokenData[]
  theme: Theme
  title?: string
}

export { IProps }