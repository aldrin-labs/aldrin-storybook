import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles'

export interface IProps extends WithTheme<Theme> {
  open: boolean
  completeOnboarding: () => Promise<any>
}
