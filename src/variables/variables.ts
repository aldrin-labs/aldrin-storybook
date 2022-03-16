import RinLogo from '@icons/DarkLogo.svg'

import { COLORS } from './colors'
import { FONT_SIZES } from './fonts'
import { THEME } from './theme'

export const MAIN_FONT = 'Avenir Next'
export const FONTS = {
  main: `${MAIN_FONT}, sans-serif;`,
  demi: `${MAIN_FONT} Demi, sans-serif`,
}

export { COLORS, THEME }

export const BORDER_RADIUS = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '32px',
  xxl: '56px',
}

export { FONT_SIZES }

export const BREAKPOINTS = {
  xs: '480px',
  sm: '540px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1400px',
}

export const SIZE = {
  fontSize: '16px',
  defaultPadding: '10px',
}

export const WIDTH = {
  sm: '10%',
  md: '30%',
  lg: '60%',
  xl: '100%',
}

export const BUTTON_PADDINGS = {
  md: '4px 10px', // 16px
  lg: '8px 16px',
}

export const LAYOUT_WIDTH = 1280
export const LAYOUT_COL_NUMBER = 12

export const TRANSITION = 'all ease-in 0.2s'

export const LOGO = RinLogo
