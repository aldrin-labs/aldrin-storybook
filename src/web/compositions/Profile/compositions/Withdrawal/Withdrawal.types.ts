export interface IProps {
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
  withdrawalMutation: (variablesObj: {
    variables: {
      input: {
        keyId: string
        symbol: string
        address: string
        amount: number
      }
    }
  }) => Promise<{ data: string; status: 'ERR' | 'OK'; errorMessage: string }>
  confirmWithdrawalMutation: (variablesObj: {
    variables: {
      input: {
        keyId: string
        hash: string
      }
    }
  }) => Promise<{ data: string; status: 'ERR' | 'OK'; errorMessage: string }>
}
