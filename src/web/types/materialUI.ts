import {
  Theme as ThemeType,
  ConsistentWith as ConsistentWithType,
} from '@material-ui/core'
import {
  withTheme as withThemeFunc,
  WithTheme as WithThemeType,
} from '@material-ui/styles'

import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { PaletteOptions } from '@material-ui/core/styles/createPalette'


export type WithTheme = WithThemeType
export type Theme = ThemeType
export type ConsistentWith = ConsistentWithType
export const withTheme = withThemeFunc


export interface ThemeWrapperProps {
  themeMode: 'dark' | 'light'
  children: React.ReactChild
}

interface CustomTextProps {
  dark?: string
  subPrimary?: string
  grey?: string
  light?: string
  white?: string
  text?: string
  black?: string
  blue?: string
}

interface CustomColors {
  backround?: string
  custom?: string
  dark?: string
  light?: string
  main?: string
  background?: string
  text?: string
  border?: string
  cream?: string
  additional?: string
  block?: string
  circle?: string
  chart?: string
  input?: string
  back?: string
  newborder?: string
  placeholder?: string
  disabledInput?: string
  title?: string
  terminal?: string
  new?: string
  registration?: string
  card?: string
  bright?: string
  first?: string
  second?: string
  btnBackground?: string
  switcherBackground?: string
  switcherBorder?: string
  serum?: string
  tab?: string
  shine?: string
  descrip?: string
  acid?: string
  analytics?: string
  button?: string
  primary?: string
  inputBackground?: string
  greyish?: string
}

interface CustomBackground {
  table?: string
  smoke?: string
}

interface BorderColors {
  main?: string
  new?: string
}

interface HoverColors {
  dark?: string
  light?: string
}

interface ButtonColors {
  color?: string
}

interface ChartColors {
  redStroke: string
  greenStroke: string
  greenBackground: string
  redBackground: string
}

interface OrderBookColors {
  greenBackground: string
  redBackground: string
}

interface SliderColors {
  dots: string
  rail: string
}

interface PaletteColors {
  grey?: CustomColors
  orange?: CustomColors
  background?: CustomBackground
  black?: CustomColors
  red?: CustomColors
  blue?: CustomColors
  green?: CustomColors
  dark?: CustomColors
  white?: CustomColors
}

interface Palette extends PaletteColors {
  border?: BorderColors
  hover?: HoverColors
  button?: ButtonColors
  depthChart?: ChartColors
  orderbook?: OrderBookColors
  slider: SliderColors
}

export interface ITheme extends ThemeOptions {
  palette?: PaletteOptions & { text?: CustomTextProps } & Palette;
  customPalette: PaletteColors
}