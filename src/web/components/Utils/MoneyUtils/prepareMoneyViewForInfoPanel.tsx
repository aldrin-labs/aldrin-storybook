export const slicePrice = (availableValue) => {
  let result = ''
  !availableValue.indexOf('-')
    ? (result = `0`)
    : availableValue !== '0'
    ? (result = availableValue.substring(0, availableValue.indexOf('.')))
    : (result = availableValue)
  return result
}
