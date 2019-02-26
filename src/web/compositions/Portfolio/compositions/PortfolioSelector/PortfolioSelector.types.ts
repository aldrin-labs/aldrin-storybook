import React from 'react'
import { WithTheme } from '@material-ui/core'
import { KeyOrWallet } from '@core/types/PortfolioTypes'
import { DustFilterType } from '@core/types/PortfolioTypes'

export interface IProps extends WithTheme {
  isSideNavOpen: boolean
  toggleWallets: React.ReactEventHandler
  activeWallets: string[]
  activeKeys: string[]
  newKeys: KeyOrWallet[]
  newWallets: KeyOrWallet[]
  portfolioId: string
  dustFilter: DustFilterType
  login: boolean

}

