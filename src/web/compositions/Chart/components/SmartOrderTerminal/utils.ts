import { DefaultTheme } from 'styled-components'

const values = [
  ['short', 'long'],
  ['sell', 'buy'],
  ['market', 'limit'],
]

export const getSecondValueFromFirst = (value: string): string => {
  const pairValues = values.find((arr) => {
    if (arr[0] === value || arr[1] === value) return true
    return false
  })

  if (pairValues !== undefined) {
    return pairValues.find((el) => el !== value)
  }

  return ''
}

const CommonSwitcherStyles = {
  activeColor: '#fff',
  borderRadius: '0',
}

export const GreenSwitcherStyles = (theme: DefaultTheme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.colors.green7,
  activeBorderColor: theme.colors.green7,
})

export const DisabledSwitcherStyles = (theme: DefaultTheme) => ({
  ...CommonSwitcherStyles,
  activeColor: theme.colors.gray1,
  activeBorderColor: theme.colors.gray1,
})

export const RedSwitcherStyles = (theme: DefaultTheme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.colors.red4,
  activeBorderColor: theme.colors.red4,
})

export const BlueSwitcherStyles = (theme: DefaultTheme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.colors.blue5,
  activeBorderColor: theme.colors.blue5,
})
