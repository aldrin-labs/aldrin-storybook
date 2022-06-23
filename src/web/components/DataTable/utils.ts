import { SORT_ORDER, DataCellValues } from './types'

export const nextSortOrder = (so: SORT_ORDER) => {
  switch (so) {
    case SORT_ORDER.DESC:
      return SORT_ORDER.ASC
    default:
      return SORT_ORDER.DESC
  }
}

export function sortData<E>(
  data: DataCellValues<E>[],
  sortColumn: string,
  sortOrder: SORT_ORDER
) {
  if (!sortColumn || sortOrder === SORT_ORDER.NONE) {
    return data
  }

  const sortMultiplier = sortOrder === SORT_ORDER.ASC ? 1 : -1
  return [...data].sort((a, b) => {
    if (!a.fields[sortColumn] || !b.fields[sortColumn]) {
      return 0
    }
    if (a.fields[sortColumn].rawValue > b.fields[sortColumn].rawValue) {
      return 1 * sortMultiplier
    }
    if (a.fields[sortColumn].rawValue < b.fields[sortColumn].rawValue) {
      return -1 * sortMultiplier
    }
    return 0
  })
}
