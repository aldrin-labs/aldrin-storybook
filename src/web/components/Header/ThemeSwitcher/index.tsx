import React from 'react'
import { useTheme } from 'styled-components'
import useSWR from 'swr'

import SvgIcon from '@sb/components/SvgIcon'
import { THEME_DARK, THEME_LIGHT } from '@sb/compositions/App/themes'

import MoonActive from './images/moon_active.svg'
import Moon from './images/moon.svg'
import SunActive from './images/sun_active.svg'
import Sun from './images/sun.svg'
import { SwitcherContainer, SwitchControl } from './styles'

export const ThemeSwitcher = ({
  setCurrentTheme,
}: {
  setCurrentTheme: (a: string) => void
}) => {
  const theme = useTheme()
  const { mutate } = useSWR('theme', () => localStorage.getItem('theme'))

  const handleChange = () => {
    if (theme.name === THEME_DARK) {
      setCurrentTheme(THEME_LIGHT)
      localStorage.setItem('theme', THEME_LIGHT)
      mutate()
    } else {
      setCurrentTheme(THEME_DARK)
      localStorage.setItem('theme', THEME_DARK)
      mutate()
    }
  }

  return (
    <SwitcherContainer>
      <SwitchControl $active={theme.name === THEME_DARK} onClick={handleChange}>
        <SvgIcon src={theme.name === THEME_DARK ? MoonActive : Moon} />
      </SwitchControl>
      <SwitchControl
        $active={theme.name === THEME_LIGHT}
        onClick={handleChange}
      >
        <SvgIcon src={theme.name === THEME_LIGHT ? SunActive : Sun} />
      </SwitchControl>
    </SwitcherContainer>
  )
}
