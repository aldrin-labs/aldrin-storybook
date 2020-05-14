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
  getActivePromoQuery: {
    getActivePromo: {
      name: string
      code: string
      description: string
    }
  }
  bonusRequestMutation: () => Promise<{
    data: {
      bonusRequest: {
        status: 'ERR' | 'OK'
        errorMessage: string
        data: string
      }
    }
  }>
}
