import { Theme } from '@material-ui/core'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'
import {
  DustFilterType,
  SharePortfolioMutationType,
} from '@core/types/PortfolioTypes'
import { Key } from '@sb/compositions/Portfolio/Portfolio.types'

export interface IState {
  key: number
  startDate: any
  endDate: any
  openSharePortfolioPopUp: boolean
}

export interface IProps extends TooltipMutationType, TooltipQueryType {
  theme: Theme
  dustFilter: DustFilterType
  sharePortfolioMutation: SharePortfolioMutationType
  portfolioId: string
  portfolioName: string
  portfolioKeys: Key[]
  getActivePromoQuery: {
    getActivePromo: {
      name: string
      code: string
      description: string
    }
  }
}
