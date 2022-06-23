import React from 'react'
import Switch from 'react-switch'
import useSWR from 'swr'

import SvgIcon from '@sb/components/SvgIcon'

import Moon from '@icons/moon.svg'
import Sun from '@icons/sun.svg'

import { SwitcherContainer, IconContainer } from './styles'

export const ThemeSwitcher = ({
  currentTheme,
  setCurrentTheme,
}: {
  currentTheme: string
  setCurrentTheme: (a: string) => void
}) => {
  const { mutate } = useSWR('theme', () => localStorage.getItem('theme'))

  const handleChange = () => {
    if (currentTheme === 'dark') {
      setCurrentTheme('light')
      localStorage.setItem('theme', 'light')
      mutate()
    } else {
      setCurrentTheme('dark')
      localStorage.setItem('theme', 'dark')
      mutate()
    }
  }

  return (
    <SwitcherContainer>
      <Switch
        onChange={handleChange}
        checked={currentTheme === 'dark'}
        className="theme-switch"
        width={50}
        offColor="#F0F0F2"
        onColor="#47FFA7"
        offHandleColor="#fff"
        onHandleColor="#14141F"
        activeBoxShadow="0px 3px 7px rgba(0, 107, 55, 0.8)"
        uncheckedIcon={<div />}
        checkedIcon={<div />}
        uncheckedHandleIcon={
          <IconContainer>
            <SvgIcon src={Sun} />
          </IconContainer>
        }
        checkedHandleIcon={
          <IconContainer>
            <SvgIcon src={Moon} />
          </IconContainer>
        }
      />
    </SwitcherContainer>
  )
}
