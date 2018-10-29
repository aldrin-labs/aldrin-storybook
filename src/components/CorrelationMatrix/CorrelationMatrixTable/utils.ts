import { darken } from '@material-ui/core/styles/colorManipulator'

export function getColorDarken(
  value: string,
  colors: string[],
  oneColor: string,
  darkenCoeff?: number
  ) {
  const n = Number(value)
  if (oneColor && n === 1) {
    return oneColor
  }
  if (n < 0) return darken(colors[0], (1 + n) * (darkenCoeff || 1))
  if (n === 1) return colors[1]
  return darken(colors[2], (1 - n) * (darkenCoeff || 1))
}