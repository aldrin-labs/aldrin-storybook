export const slicePrice = (availableValue = '0') => {
  let result = '0'
  if (+availableValue === 0) return result

  !availableValue.indexOf('-')
    ? (result = `0`)
    : availableValue !== '0'
    ? (result = availableValue.substring(0, availableValue.indexOf('.')))
    : (result = availableValue)
  return result
}
