import { Theme } from '@material-ui/core'

export type ICurrentStep =
  | 'start'
  | 'createPortfolio'
  | 'addAccount'
  | 'congratulations'
  | 'binanceAccountCreated'
  | 'binanceAccountCreatedLater'

export type ITooltip = {
  getTooltipSettings: {
    onboarding: {
      instructions: boolean
    }
  }
}

export type IVariables = {
  variables: {
    settings: ITooltip
  }
  update(): void
}

type PorfolioKey = {
  selected: boolean
  name: string
  _id: string
}

export interface IProps {
  getTooltipSettingsQuery: ITooltip
  updateTooltipSettings: (setting: IVariables) => boolean
  portfolioKeys: PorfolioKey[]
  portfoliosNumber: number
  baseCoin: 'USDT' | 'BTC'
  theme: Theme
  numberOfKeys: number
}
