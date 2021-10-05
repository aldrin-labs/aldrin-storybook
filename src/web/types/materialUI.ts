import { ConsistentWith as ConsistentWithType, Theme as ThemeType } from '@material-ui/core'
import {
  withTheme as withThemeFunc,
  WithTheme as WithThemeType
} from '@material-ui/styles'
import * as React from 'react'

export type WithTheme = WithThemeType
export type Theme = ThemeType
export type ConsistentWith = ConsistentWithType
export const withTheme = withThemeFunc
  ;

export default function useTheme() {
  const theme = React.useContext(ThemeContext);

  return theme;
}