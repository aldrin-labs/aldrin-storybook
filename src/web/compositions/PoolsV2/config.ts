import { toMap } from '@core/collection'

export const labels = [
  { name: 'Moderated', backgroundColor: 'green9', color: 'green7' },
  { name: 'Stable', backgroundColor: 'yellow0', color: 'yellow1' },
  { name: 'Permissionless', backgroundColor: 'blue0', color: 'blue1' },
  { name: 'New', backgroundColor: 'red0', color: 'red1' },
  { name: 'Default', backgroundColor: 'gray15', color: 'gray13' },
]

export const LABEL_TYPES = {
  red: { backgroundColor: 'red0', color: 'red1' },
  green: { backgroundColor: 'green9', color: 'green7' },
  yellow: { backgroundColor: 'yellow0', color: 'yellow1' },
  blue: { backgroundColor: 'blue0', color: 'blue1' },
  default: { backgroundColor: 'gray15', color: 'gray13' },
}

export const FILTER_LABELS = [
  {
    labelStyle: LABEL_TYPES.green,
    text: 'Moderated',
    hoverStyle: LABEL_TYPES.green,
  },
  {
    labelStyle: LABEL_TYPES.yellow,
    text: 'Stable',
    hoverStyle: LABEL_TYPES.yellow,
  },
  {
    labelStyle: LABEL_TYPES.blue,
    text: 'Permissionless',
    hoverStyle: LABEL_TYPES.blue,
  },
]

export const POOL_CARD_LABELS = [
  { labelStyle: LABEL_TYPES.default, text: 'New', hoverStyle: LABEL_TYPES.red },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Moderated',
    hoverStyle: LABEL_TYPES.green,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Stable',
    hoverStyle: LABEL_TYPES.yellow,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Permissionless',
    hoverStyle: LABEL_TYPES.blue,
  },
]

export const labelsMap = toMap(labels, (el) => el.name)
