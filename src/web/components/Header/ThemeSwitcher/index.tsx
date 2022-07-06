import React from 'react'
import useSWR from 'swr'
import { useTheme } from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'

import MoonActive from './images/moon_active.svg'
import Moon from './images/moon.svg'
import SunActive from './images/sun_active.svg'
import Sun from './images/sun.svg'
import { SwitcherContainer, SwitchControl } from './styles'

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

export const ThemeSwitcher = ({
  setCurrentTheme,
}: {
  setCurrentTheme: (a: string) => void
}) => {
  const theme = useTheme()
  const { mutate } = useSWR('theme', () => localStorage.getItem('theme'))

  const handleChange = () => {
    if (theme.name === DARK_THEME) {
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
      <SwitchControl $active={theme.name === DARK_THEME} onClick={handleChange}>
        <SvgIcon src={theme.name === DARK_THEME ? MoonActive : Moon} />
      </SwitchControl>
      <SwitchControl
        $active={theme.name === LIGHT_THEME}
        onClick={handleChange}
      >
        <SvgIcon src={theme.name === LIGHT_THEME ? SunActive : Sun} />
      </SwitchControl>
    </SwitcherContainer>
  )
}
