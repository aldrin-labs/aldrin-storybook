import React from 'react'

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
    tooltipText:
      'Pools that are launched and managed by Aldrin or our verified partners.',
  },
  {
    labelStyle: LABEL_TYPES.yellow,
    text: 'Stable',
    hoverStyle: LABEL_TYPES.yellow,
    tooltipText: (
      <>
        <p>
          This pool uses the stable curve, which provides better rates for
          trading stablecoins.
        </p>
        <p>
          This pool is not at risk of impermanent loss. However, this does not
          mean that you will be able to deposit tokens 1 to 1, the deposit ratio
          still depends on the pool ratio.
        </p>
      </>
    ),
  },
  {
    labelStyle: LABEL_TYPES.blue,
    text: 'Permissionless',
    hoverStyle: LABEL_TYPES.blue,
    tooltipText:
      'Pools that are launched and managed by third parties. To trust or not to trust is your choice. DYOR.',
  },
]

export const POOL_CARD_LABELS = [
  {
    labelStyle: LABEL_TYPES.default,
    text: 'Locked',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33334 10.1933V3.80668C1.33334 2.92001 1.84668 2.70668 2.47334 3.33335L4.20001 5.06001C4.46001 5.32001 4.88668 5.32001 5.14001 5.06001L7.52668 2.66668C7.78668 2.40668 8.21334 2.40668 8.46668 2.66668L10.86 5.06001C11.12 5.32001 11.5467 5.32001 11.8 5.06001L13.5267 3.33335C14.1533 2.70668 14.6667 2.92001 14.6667 3.80668V10.2C14.6667 12.2 13.3333 13.5333 11.3333 13.5333H4.66668C2.82668 13.5267 1.33334 12.0333 1.33334 10.1933Z"
          stroke="#A9A9B2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    hoverStyle: LABEL_TYPES.locked,
  },
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

export const farmingDurations = [
  { value: '14', title: '14 Days' },
  { value: '30', title: '30 Days' },
  { value: '90', title: '90 Days' },
  { value: '365', title: '365 Days' },
]
