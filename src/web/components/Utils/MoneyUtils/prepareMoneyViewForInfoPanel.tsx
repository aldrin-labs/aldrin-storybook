export const slicePrice = (availableValue = '0') => {
  if (+availableValue === 0) return '0'

  return +availableValue < 0 ? '0' : Math.floor(availableValue).toString()
}
