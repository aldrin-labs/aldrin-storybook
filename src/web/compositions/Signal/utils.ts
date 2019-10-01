export const checkValue = (value: number | string, formatted: any) => {
  if (value === 0 || value === '0') return 0
  return value ? formatted : '-'
}
