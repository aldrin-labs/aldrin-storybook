import React from 'react'
import { WithTheme } from '@material-ui/core'
import { KeyOrWallet } from '@core/types/PortfolioTypes'

export interface IProps extends WithTheme {
  filterValuesLessThenThat: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  toggleWallets: React.ReactEventHandler
  filterPercent: number
  setKeys: Function
  setActiveKeys: Function
  setWallets: Function
  setActiveWallets: Function
  wallets: string[]
  activeWallets: string[]
  keys: string[]
  activeKeys: string[]
  newKeys: KeyOrWallet[]
  newWallets: KeyOrWallet[]
  portfolioId: string
  dustFilter: number
  login: boolean
}

