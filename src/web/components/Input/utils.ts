export const DOUBLE_REGEXP = /^\d+(\.?)\d{0,}$/
export const INT_REGEXP = /^\d{0,}$/

export const validateRegexp = (regexp: RegExp, v: string) => {
  const isValid = !!v.match(regexp)
  if (!isValid) {
    return false
  }
  return true
}

export const validateDecimal = (v: string) => validateRegexp(DOUBLE_REGEXP, v)
export const validateNatural = (v: string) => validateRegexp(INT_REGEXP, v)
