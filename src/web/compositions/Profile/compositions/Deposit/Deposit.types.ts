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
}
