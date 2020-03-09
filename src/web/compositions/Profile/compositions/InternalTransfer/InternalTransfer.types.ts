import { withSnackbarProps } from 'notistack'

export type ReactSelectOptionType = {
  label: string
  value: string
}

export type SelectedCoinType = {
  label: string
  name: string
}

export interface IProps extends withSnackbarProps {
  selectedCoin: SelectedCoinType
  setSelectedCoin: (arg: SelectedCoinType) => Promise<void>
  selectedKeyFrom: ReactSelectOptionType
  selectedKeyTo: ReactSelectOptionType
  selectKeyFrom: (arg: ReactSelectOptionType) => Promise<void>
  selectKeyTo: (arg: ReactSelectOptionType) => Promise<void>
  selectedPortfolioFrom: ReactSelectOptionType
  selectedPortfolioTo: ReactSelectOptionType
  selectPortfolioFrom: (arg: ReactSelectOptionType) => Promise<void>
  selectPortfolioTo: (arg: ReactSelectOptionType) => Promise<void>
  getAssetDetailQuery: {
    getAssetDetail: {
      minWithdrawAmount: number
      depositStatus: boolean
      withdrawFee: number
      withdrawStatus: boolean
      depositTip: string
    }
  }
  getProfileSettingsQuery: {
    getProfileSettings: {
      internalTransferSettings: {
        selectedKeyTo: string
        selectedKeyFrom: string
      }
    }
  }
  transferInternalMutation: (variablesObj: {
    variables: {
      input: {
        keyIdFrom: string
        keyIdTo: string
        symbol: string
        amount: number
      }
    }
  }) => Promise<{
    data: {
      transferInternal: {
        status: 'ERR' | 'OK'
        data: string | null
        errorMessage: string
      }
    }
  }>
}
