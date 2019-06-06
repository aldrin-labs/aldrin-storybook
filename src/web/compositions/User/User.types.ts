
export interface IState {
  showBinanceWarning: boolean
}

export interface IProps {
  getMocksModeQuery: {
    app: {
      mocksEnabled: boolean
    }
  }
  toggleMocksMutation: () => Promise<any>
}
