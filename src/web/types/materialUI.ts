import {
  Theme as ThemeType,
  ConsistentWith as ConsistentWithType,
} from '@material-ui/core'
import {
  withTheme as withThemeFunc,
  WithTheme as WithThemeType,
} from '@material-ui/styles'

export type WithTheme = WithThemeType
export type Theme = ThemeType
export type ConsistentWith<DecorationTargetProps, InjectedProps> =
  ConsistentWithType<DecorationTargetProps, InjectedProps>
export const withTheme = withThemeFunc
