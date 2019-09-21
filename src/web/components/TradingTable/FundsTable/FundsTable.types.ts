import { ChangeEvent } from 'react'
import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'

import { FundsType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  handleTabChange: (tab: string | any) => void
  show: boolean
  getFundsQuery: {
    getFunds: FundsType[]
  }
  subscribeToMore: () => void
  theme: Theme
  selectedKey: Key
}

export interface IState {
  fundsProcessedData: any[]
  hideSmallAssets: boolean
}
