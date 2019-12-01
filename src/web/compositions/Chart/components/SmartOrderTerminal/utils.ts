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
  activeColor: '#fff',
  borderRadius: '1.5rem',
}

export const GreenSwitcherStyles = {
  ...CommonSwitcherStyles,
  activeBackgroundColor: 'rgba(41, 172, 128, 0.49)',
  activeBorderColor: '#29AC80',
}

export const RedSwitcherStyles = {
  ...CommonSwitcherStyles,
  activeBackgroundColor: 'rgba(221, 105, 86, 0.5)',
  activeBorderColor: '#DD6956',
}

export const BlueSwitcherStyles = {
  ...CommonSwitcherStyles,
  activeBackgroundColor: 'rgba(11, 31, 209, 0.5)',
  activeBorderColor: '#0B1FD1',
}
