import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { FundsType } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  tabIndex: number
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  show: boolean
  getFundsQuery: {
    getFunds: FundsType[]
  }
  subscribeToMore: () => void
  theme: Theme
}

export interface IState {
  fundsProcessedData: any[]
  hideSmallAssets: boolean
}
