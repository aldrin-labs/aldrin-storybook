import { darken } from '@material-ui/core/styles/colorManipulator'

export function getColorDarken(
  value: string,
  colors: string[],
  darkenCoeff?: number
  ) {
  const n = Number(value)
  if (n < 0) return darken(colors[0], (1 + n) * (darkenCoeff || 1))
  if (n === 0) return colors[1]
  if (n === 1) return colors[3]
  return darken(colors[2], (1 - n) * (darkenCoeff || 1))
}