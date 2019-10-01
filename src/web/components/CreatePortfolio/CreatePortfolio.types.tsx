export interface IState {
  open: boolean
  isSelected: boolean
  error: string
  portfolioName: string
}

type CreateVariables = {
  variables: {
    inputPortfolio: {
      name: string
    }
  }
}

type RenameVariables = {
  variables: {
    inputPortfolio: {
      name: string
      id: string
    }
  }
}

type CreateResponse = {
  data: {
    createPortfolio: {
      error: string
      executed: boolean
    }
  }
}

type RenameResponse = {
  data: {
    renamePortfolio: {
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
  createPortfolio(variables: CreateVariables): CreateResponse
  renamePortfolio(variables: RenameVariables): RenameResponse
  setCurrentStep(step: string): void
  onboarding: boolean
  open: boolean
  portfolioId: string
  title: string
}
