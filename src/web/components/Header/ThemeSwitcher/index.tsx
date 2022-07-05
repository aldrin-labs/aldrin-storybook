import React from 'react'
import useSWR from 'swr'

import SvgIcon from '@sb/components/SvgIcon'

import Moon from './images/moon.svg'
import MoonActive from './images/moon_active.svg'
import Sun from './images/sun.svg'
import SunActive from './images/sun_active.svg'

import { SwitcherContainer, SwitchControl } from './styles'

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

export const ThemeSwitcher = ({
  currentTheme,
  setCurrentTheme,
}: {
  currentTheme: string
  setCurrentTheme: (a: string) => void
}) => {
  const { mutate } = useSWR('theme', () => localStorage.getItem('theme'))

  const handleChange = () => {
    if (currentTheme === DARK_THEME) {
      setCurrentTheme(LIGHT_THEME)
      localStorage.setItem('theme', LIGHT_THEME)
      mutate()
    } else {
      setCurrentTheme(DARK_THEME)
      localStorage.setItem('theme', DARK_THEME)
      mutate()
    }
  }

  return (
    <SwitcherContainer>
      <SwitchControl
        $active={currentTheme === DARK_THEME}
        onClick={handleChange}
      >
        <SvgIcon src={currentTheme === DARK_THEME ? MoonActive : Moon} />
      </SwitchControl>
      <SwitchControl
        $active={currentTheme === LIGHT_THEME}
        onClick={handleChange}
      >
        <SvgIcon src={currentTheme === LIGHT_THEME ? SunActive : Sun} />
      </SwitchControl>
    </SwitcherContainer>
  )
}
