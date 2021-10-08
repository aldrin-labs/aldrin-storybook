export interface IProps {
  portfolioKeys: { _id: string; name: string }[]
  portfolioId: string
  openSharePortfolioPopUp: boolean
  handleCloseSharePortfolio: () => void
  sharePortfolioTitle: string
  sharePortfolioMutation: ({
    variables,
  }: {
    variables: {
      inputPortfolio: { id: string }
      optionsPortfolio: { userId?: string; forAll?: boolean }
    }
  }) => Promise<boolean>
}

export interface IState {
  selectedUsername: null | { label: string; value: string }
  shareWithSomeoneTab: boolean
  selectedUserEmail: any
  selectedAccounts: string[]
  showPortfolioValue: boolean
  selectedPortfolioTypes: string[]
  tradeFrequency: string
  isPortfolioFree: boolean
  portfolioPrice: string
  marketName: string
  portfolioDescription: string
  openLinkPopup: boolean
  openInvitePopup: boolean
}
