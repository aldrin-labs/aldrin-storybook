import { Theme } from '@material-ui/core'

export interface IProps {
  title: string
  theme: Theme
  rebalanceChartsData: {
    data: {x: string, y: string}[],
    title: string
    color: string
  }[]
}
