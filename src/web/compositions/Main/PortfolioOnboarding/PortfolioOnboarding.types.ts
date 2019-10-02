import { Theme } from '@material-ui/core'

export type ICurrentStep =
  | 'start'
  | 'createPortfolio'
  | 'addAccount'
  | 'congratulations'

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

export interface IProps {
  getTooltipSettingsQuery: ITooltip
  updateTooltipSettings(setting: IVariables): boolean
  portfolioId: string
  baseCoin: 'USDT' | 'BTC'
  theme: Theme
}
