import { merge } from 'lodash-es'
import React from 'react'
import { ThemeProvider } from 'styled-components'

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'

const BASE_THEME = {
  colors: {
    yellow9: '#635901FF',
    yellow8: '#827501FF',
    yellow7: '#A89701FF',
    yellow6: '#D7C202FF',
    yellow5: '#ECD401FF',
    yellow4: '#F0DD35FF',
    yellow3: '#F2E45DFF',
    yellow2: '#F6ED96FF',
    yellow1: '#FAF5C6FF',
    yellow0: '#FDFBE6FF',
    red9: '#6B1B0CFF',
    red8: '#8C2410FF',
    red7: '#B52E15FF',
    red6: '#E83B1AFF',
    red5: '#FF411DFF',
    red4: '#FF674AFF',
    red2: '#FF8068FF',
    red1: '#FFC4B9FF',
    red0: '#FFECE8FF',
    violet9: '#2F006BFF',
    violet8: '#3D008CFF',
    violet7: '#4F00B5FF',
    violet6: '#6500E8FF',
    violet5: '#6F00FFFF',
    violet4: '#8B33FFFF',
    violet2: '#BD8AFFFF',
    violet1: '#D2B0FFFF',
    violet0: '#F1E6FFFF',
    green9: '#006B37FF',
    green7: '#00B55EFF',
    green5: '#00F47EFF',
    green2: '#70FFBAFF',
    green1: '#8EFEC8FF',
    green0: '#C1FFE1FF',
    blue9: '#060163FF',
    blue8: '#080182FF',
    blue7: '#0A01A8FF',
    blue6: '#0D02D7FF',
    blue5: '#0E02ECFF',
    blue4: '#3E35F0FF',
    blue2: '#908BF6FF',
    blue1: '#B4B1F9FF',
    blue0: '#E7E6FDFF',
    primaryWhite: '#fff',
    swapValueBtnHover: '#d4d4da',
    swapValueBtnActive: '#bdbdc2',
    swapSetAmountHover: '#bfbfc2',
    swapSetAmountActive: '#aaaaac',
  },
}

const THEMES = {
  [THEME_DARK]: {
    name: THEME_DARK,
    colors: {
      red3: '#FF8068FF',
      violet3: '#9F54FFFF',
      green8: '#00ff8426',
      green6: '#47FFA7FF',
      green4: '#00FF84FF',
      green3: '#47FFA7FF',
      blue3: '#5E55F2FF',
      gray12: '#303041',
      gray11: '#3F3F50',
      gray10: '#14131FFF',
      gray9: '#0B0B12FF',
      gray8: '#2b2d36',
      gray7: '#14141F',
      gray6: '#181825FF',
      gray5: '#302F41',
      gray4: '#3F3E4FFF',
      gray3: '#A9A9B2',
      gray2: '#96999c',
      gray1: '#A8A8B2FF',
      gray0: '#E8E8EA',
      white: '#F9F9F9FF',
      black: '#050405FF',
      logo: '#F5F5FB',
      border: '#302F41',
      block: '#383b45',
      line: '#0B0B12FF',
      disabled: 'rgba(48, 47, 65, 0.25)',
      obGreenBack: 'rgba(143, 255, 200, 0.25)',
      obGreenFont: 'rgba(71, 255, 167, 1)',
      obRedBack: 'rgba(255, 128, 104, 0.2)',
      obRedFont: 'rgba(255, 128, 104, 1)',
      tooltip: '#222429',
      greenChart: ['rgba(143, 255, 200, 0.25)', 'rgba(143, 255, 200, 0)'],
      shadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.45)',
      header: '#0B0B13',
      border1: '#212131',
      PURewardsBackground: 'rgba(0, 255, 132, 0.15)',
    },
  },
  [THEME_LIGHT]: {
    name: THEME_LIGHT,
    colors: {
      red3: '#E83B1AFF',
      violet3: '#6500E8FF',
      green8: '#00b55e33',
      green6: '#00b55eFF',
      green4: '#00B55EFF',
      green3: '#00B55E',
      blue3: '#5E55F2',
      gray12: '#303041',
      gray11: '#D4D4D7',
      gray10: '#FAFAFA',
      gray9: '#FAFAFA',
      gray8: '#A9A9B2',
      gray7: '#FFFFFF',
      gray6: '#F3F3F7',
      gray5: '#ECECF2',
      gray4: '#FFFFFF',
      gray3: '#5B5A72',
      gray2: '#A8A8B2FF',
      gray1: '#82819CFF',
      gray0: '#65666E',
      white: '#65666E',
      black: '#F9F9F9FF',
      logo: '#302F41',
      border: '#FAFAFA',
      line: '#E8E8E9FF',
      block: '#A9A9B2',
      disabled: 'rgb(214, 216, 224)',
      obGreenBack: 'rgba(0, 232, 120, 0.2)',
      obGreenFont: 'rgba(0, 181, 94, 1)',
      obRedBack: 'rgba(255, 103, 74, 0.2)',
      obRedFont: 'rgba(255, 65, 29, 1)',
      tooltip: 'rgb(214, 216, 224)',
      greenChart: ['rgba(0, 181, 92, 0.39)', 'rgba(0, 181, 94, 0)'],
      shadow: '0px 0px 8px 0px rgba(169, 169, 178, 1)',
      header: '#FAFAFA',
      border1: 'rgba(169, 169, 178, 0.3)',
      PURewardsBackground: 'rgba(0, 181, 94, 0.2)',
    },
  },
}

type ThemeProps = {
  children: React.ReactNode
  theme: 'dark' | 'light'
}

export const Theme = (props: ThemeProps) => {
  const { theme, children } = props

  return (
    <ThemeProvider theme={merge(BASE_THEME, THEMES[theme])}>
      {children}
    </ThemeProvider>
  )
}
