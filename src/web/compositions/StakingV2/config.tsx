export const labels = [
  { name: 'Moderated', backgroundColor: 'green1', color: 'green1' },
  { name: 'Stable', backgroundColor: 'violet2', color: 'violet2' },
  { name: 'Permissionless', backgroundColor: 'yellow1', color: 'yellow1' },
  { name: 'New', backgroundColor: 'red0', color: 'red0' },
  { name: 'Default', backgroundColor: 'white2', color: 'white2' },
]

export const LABEL_TYPES = {
  red: { backgroundColor: 'red0', color: 'red0' },
  green: { backgroundColor: 'green1', color: 'green1' },
  yellow: { backgroundColor: 'yellow1', color: 'yellow1' },
  blue: { backgroundColor: 'violet2', color: 'violet2' },
  locked: { backgroundColor: 'yellow4', color: 'yellow4' },
  default: { backgroundColor: 'white2', color: 'white2' },
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

export const STAKING_CARD_LABELS = [
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Auto-Compound',
    hoverStyle: LABEL_TYPES.default,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Plutonians',
    hoverStyle: LABEL_TYPES.default,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'NFT Rewards',
    hoverStyle: LABEL_TYPES.default,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Liquid',
    hoverStyle: LABEL_TYPES.default,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Lido',
    hoverStyle: LABEL_TYPES.default,
  },
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Marinade',
    hoverStyle: LABEL_TYPES.default,
  },
]

export const RIN_DECIMALS = 9

export const SOL_GAP_AMOUNT = 0.0127 // to allow transactions pass
