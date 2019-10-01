export interface IState {
  open: boolean
  isSelected: boolean
  error: string
  portfolioName: string
}

type Variables = {
  variables: {
    inputPortfolio: {
      name: string
    }
  }
}

type Response = {
  data: {
    createPortfolio: {
      error: string
      executed: boolean
    }
  }
}

export interface IProps {
  theme: {
    palette: {
      black: {
        custom: string
      }
      blue: {
        custom: string
      }
    }
  }
  createPortfolio(variables: Variables): Response
}
