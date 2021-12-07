// https://stackoverflow.com/a/10456644
export const splitBy = <T>(list: T[], chunkSize: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize))
  }

  return result
}

export const toMap = <T>(
  list: T[],
  keyFn: (el: T) => string
): Map<string, T> => {
  return list.reduce(
    (acc, elem) => acc.set(keyFn(elem), elem),
    new Map<string, T>()
  )
}
