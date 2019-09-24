export interface IState {
  open: boolean
  isSelected: boolean
  name: string
  apiKey: string
  secretOfApiKey: string
  exchange: string
  error: string
}

type Variables = {
  variables: {
    name: string
    apiKey: string
    secret: string
    exchange: string
    date: number
  }
  update(
    proxy: any,
    {
      data: { addExchangeKey },
    }: Response
  ): void
}

type Response = {
  data: {
    addExchangeKey: {
      executed: boolean
      error: string
    }
  }
}

export interface IProps {
  theme: {
    palette: {
      black: {
        custom: string
      }
    }
  }
  addExchangeKey(variables: Variables): Response
}
