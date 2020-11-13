import { Theme } from '@material-ui/core'

const values = [['short', 'long'], ['sell', 'buy'], ['market', 'limit']]

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
  activeColor: '#0B0B0E',
  borderRadius: '0',
}

export const GreenSwitcherStyles = (theme: Theme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.palette.green.main,
  activeBorderColor: theme.palette.green.main,
})

export const DisabledSwitcherStyles = (theme: Theme) => ({
  ...CommonSwitcherStyles,
  activeColor: theme.palette.grey.text,
  activeBorderColor: theme.palette.border.main,
})

export const RedSwitcherStyles = (theme: Theme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.palette.red.main,
  activeBorderColor: theme.palette.red.main,
})

export const BlueSwitcherStyles = (theme: Theme) => ({
  ...CommonSwitcherStyles,
  activeBackgroundColor: theme.palette.white.btnBackground,
  activeBorderColor: theme.palette.blue.main,
  activeColor: theme.palette.blue.main,
})
