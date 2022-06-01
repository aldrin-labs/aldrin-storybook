import React from 'react'
import Switch from 'react-switch'
import { useTheme } from 'styled-components'
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
  const theme = useTheme()
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
        checked={currentTheme === 'light'}
        className="theme-switch"
        offColor="#181825"
        borderRadius={13}
        height={35}
        width={65}
        onColor="#F3F3F7"
        offHandleColor="#302F41"
        onHandleColor="#fff"
        activeBoxShadow="none"
        uncheckedHandleIcon={
          <IconContainer>
            <SvgIcon src={Moon} />
          </IconContainer>
        }
        checkedHandleIcon={
          <IconContainer>
            <SvgIcon src={Sun} />
          </IconContainer>
        }
        uncheckedIcon={
          <IconContainer>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.99992 10.7917C9.094 10.7917 10.7916 9.09412 10.7916 7.00004C10.7916 4.90596 9.094 3.20837 6.99992 3.20837C4.90584 3.20837 3.20825 4.90596 3.20825 7.00004C3.20825 9.09412 4.90584 10.7917 6.99992 10.7917Z"
                stroke={theme.colors.gray1}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1651 11.165L11.0892 11.0891M11.0892 2.91079L11.1651 2.83496L11.0892 2.91079ZM2.83508 11.165L2.91091 11.0891L2.83508 11.165ZM7.00008 1.21329V1.16663V1.21329ZM7.00008 12.8333V12.7866V12.8333ZM1.21341 6.99996H1.16675H1.21341ZM12.8334 6.99996H12.7867H12.8334ZM2.91091 2.91079L2.83508 2.83496L2.91091 2.91079Z"
                stroke={theme.colors.gray1}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconContainer>
        }
        checkedIcon={
          <IconContainer>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.18418 7.24498C1.39418 10.2491 3.94334 12.6933 6.99418 12.8275C9.14668 12.9208 11.0717 11.9175 12.2267 10.3366C12.705 9.68914 12.4483 9.25748 11.6492 9.40331C11.2583 9.47331 10.8558 9.50248 10.4358 9.48498C7.58334 9.36831 5.25001 6.98248 5.23834 4.16498C5.23251 3.40664 5.39001 2.68914 5.67584 2.03581C5.99084 1.31248 5.61168 0.968311 4.88251 1.27748C2.57251 2.25164 0.991678 4.57914 1.18418 7.24498Z"
                stroke={theme.colors.gray1}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconContainer>
        }
      />
    </SwitcherContainer>
  )
}
