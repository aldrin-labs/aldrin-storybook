import { withSnackbarProps } from 'notistack'

export interface IProps extends withSnackbarProps {
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
