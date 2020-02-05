import { withSnackbarProps } from 'notistack'

export interface IProps extends withSnackbarProps {
  createApiKeyMutation: (mutationObj: {
    variables: {
      token: string
    }
  }) => Promise<{
    data: {
      createApiKey: string
    }
  }>
}
