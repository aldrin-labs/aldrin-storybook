import { merge } from 'lodash-es'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'

export const THEME_COLORS = {
  L1: '#3F3F50',
  L2: '#82819C',
  L3: '#A9A9B2',
  L4: '#E8E8EA',
  L5: '#ECECF2',
  L6: '#F3F3F7',

  D1: '#FAFAFA',
  D2: '#A9A9B2',
  D3: '#5B5A72',
  D4: '#302F41',
  D5: '#212131',
  D6: '#181825',

  BL3: '#0D02D7',
  BL2: '#0A01A8',
  BL1: '#0D02D7',
  BD1: '#908BF6',
  BD2: '#3E35F0',
  BD3: '#0E02EC',
  VL3: '#3D008C',
  VL2: '#4F00B5',
  VL1: '#6500E8',
  VD1: '#6F00FF',
  VD2: '#8C33FF',
  VD3: '#9F54FF',

  // red
  RL0: '#FF674A',
  RL1: '#E83B1A',
  RL2: '#B52E15',
  RL3: '#8C2410',

  RD0: '#FF674A',
  RD1: '#FF8068',
  RD2: '#FF674A',
  RD3: '#E83B1A',

  // yellow
  YL1: '#D7C202',
  YL2: '#A89701',
  YL3: '#827501',
  YL4: '#A89701',

  YD1: '#ECD502',
  YD2: '#F0DD35',
  YD3: '#F3E45E',
  YD4: '#A89701',

  // green
  GL0: '#00F47E',
  GL1: '#00E878',
  GL2: '#00B55E',
  GL3: '#008C49',

  GD0: '#00F47E',
  GD1: '#47FFA7',
  GD2: '#00FF84',
  GD3: '#00F47E',

  // background
  BGD1: '#0C0B13',

  BGL1: '#FAFAFA',
}

const BASE_THEME = {
  colors: {
    persistent: {
      white1: '#fff',
      blue1: '#5E55F2',
    },
  },
}

const THEMES = {
  [THEME_DARK]: {
    name: THEME_DARK,
    colors: {
      red0: THEME_COLORS.RD0,
      red1: THEME_COLORS.RD1,
      red2: THEME_COLORS.RD2,
      red3: THEME_COLORS.RD3,

      violet1: THEME_COLORS.VD1,
      violet2: THEME_COLORS.VD2,
      violet3: THEME_COLORS.VD3,

      green0: THEME_COLORS.GD0,
      green1: THEME_COLORS.GD1,
      green2: THEME_COLORS.GD2,
      green3: THEME_COLORS.GD3,

      blue1: THEME_COLORS.BD1,
      blue2: THEME_COLORS.BD2,
      blue3: THEME_COLORS.BD3,

      white1: THEME_COLORS.D1,
      white2: THEME_COLORS.D2,
      white3: THEME_COLORS.D3,
      white4: THEME_COLORS.D4,
      white5: THEME_COLORS.D5,
      white6: THEME_COLORS.D6,

      yellow1: THEME_COLORS.YD1,
      yellow4: THEME_COLORS.YD4,

      background1: THEME_COLORS.BGD1,
      modal: '#14141F',
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
      shadowColor: 'rgba(0, 0, 0, 0.45)',
      header: '#0B0B13',
      border1: '#212131',
      PURewardsBackground: 'rgba(0, 255, 132, 0.15)',
    },
  },
  [THEME_LIGHT]: {
    name: THEME_LIGHT,
    colors: {
      red0: THEME_COLORS.RL0,
      red1: THEME_COLORS.RL1,
      red2: THEME_COLORS.RL2,
      red3: THEME_COLORS.RL3,

      violet1: THEME_COLORS.VL1,
      violet2: THEME_COLORS.VL2,
      violet3: THEME_COLORS.VL3,

      green0: THEME_COLORS.GL0,
      green1: THEME_COLORS.GL1,
      green2: THEME_COLORS.GL2,
      green3: THEME_COLORS.GL3,

      blue1: THEME_COLORS.BL1,
      blue2: THEME_COLORS.BL2,
      blue3: THEME_COLORS.BL3,

      white1: THEME_COLORS.L1,
      white2: THEME_COLORS.L2,
      white3: THEME_COLORS.L3,
      white4: THEME_COLORS.L4,
      white5: THEME_COLORS.L5,
      white6: THEME_COLORS.L6,

      yellow1: THEME_COLORS.YL1,
      yellow4: THEME_COLORS.YL4,

      background1: THEME_COLORS.BGL1,

      logo: '#302F41',
      border: '#FAFAFA',
      line: '#E8E8E9',
      block: '#A9A9B2',
      disabled: 'rgb(214, 216, 224)',
      obGreenBack: 'rgba(0, 232, 120, 0.2)',
      obGreenFont: 'rgba(0, 181, 94, 1)',
      obRedBack: 'rgba(255, 103, 74, 0.2)',
      obRedFont: 'rgba(255, 65, 29, 1)',
      tooltip: 'rgb(214, 216, 224)',
      greenChart: ['rgba(0, 181, 92, 0.39)', 'rgba(0, 181, 94, 0)'],
      shadow: '0px 0px 8px 0px rgba(169, 169, 178, 1)',
      shadowColor: 'rgba(169, 169, 178, 1)',
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

const ThemeContext = React.createContext<{ themeName: string } | undefined>(
  undefined
)

export const Theme: React.FC<ThemeProps> = (props) => {
  const { theme, children } = props

  const [themeName, setThemeName] = useState(theme)
  useEffect(() => {
    setThemeName(theme)
  }, [theme])
  const t = useMemo(() => merge(BASE_THEME, THEMES[theme]), [theme])
  return (
    <ThemeContext.Provider value={{ themeName }}>
      <ThemeProvider theme={t}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeName = () => useContext(ThemeContext)
