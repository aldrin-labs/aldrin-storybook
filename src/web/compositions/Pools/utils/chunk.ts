export const chunk = (arr: any[], size: number) =>
  arr.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    []
  )
