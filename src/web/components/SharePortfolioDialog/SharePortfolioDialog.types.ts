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
  shareWithSomeoneTab: boolean
  selectedUsername: any
}
