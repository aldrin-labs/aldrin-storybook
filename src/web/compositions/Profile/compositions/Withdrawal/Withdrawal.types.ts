import { withSnackbarProps } from 'notistack'
import { History } from 'history'

export interface IProps extends withSnackbarProps {
  history: History
  getProfileSettingsQuery: {
    getProfileSettings: {
      depositSettings: {
        selectedKey: string
      }
      withdrawalSettings: {
        selectedKey: string
      }
    }
  }
  getAccountSettingsQuery: {
    getAccountSettings: {
      authorizationSettings: {
        mfaEnabled: boolean
      }
    }
  }
  withdrawalMutation: (variablesObj: {
    variables: {
      input: {
        keyId: string
        symbol: string
        address: string
        amount: number
      }
    }
  }) => Promise<{
    data: {
      withdrawal: {
        status: 'ERR' | 'OK'
        data: string | null
        errorMessage: string
      }
    }
  }>
  confirmWithdrawalMutation: (variablesObj: {
    variables: {
      input: {
        keyId: string
        hash: string
      }
    }
  }) => Promise<{ data: string; status: 'ERR' | 'OK'; errorMessage: string }>
  selectedCoin: {
    label: 'BTC' | string
    name: 'Bitcoin' | string
  }
  setSelectedCoin: (arg: {
    label: 'BTC' | string
    name: 'Bitcoin' | string
  }) => void
  selectedKey: string
  getAssetDetailQuery: {
    getAssetDetail: {
      minWithdrawAmount: number
      depositStatus: boolean
      withdrawFee: number
      withdrawStatus: boolean
      depositTip: string
    }
  }
}
