import { toMap } from '@core/collection'

export const labels = [
  { name: 'Moderated', backgroundColor: 'green9', color: 'green7' },
  { name: 'Permissionless', backgroundColor: 'blue0', color: 'blue1' },
  { name: 'Stable', backgroundColor: 'yellow0', color: 'yellow1' },
  { name: 'Default', backgroundColor: 'gray15', color: 'gray13' },
]

export const labelsMap = toMap(labels, (el) => el.name)
