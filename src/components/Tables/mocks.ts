import { Head, Data } from './index.types'
import nanoid from 'nanoid'

export const mock: { head: Head[]; data: Data } = {
  head: [
    { id: 'coin', isNumber: false, label: 'Coin' },
    { id: 'coen', isNumber: true, label: 'Coen' },
    { id: 'coan', isNumber: true, label: 'Coan' },
  ],
  data: {
    body: [
      { id: nanoid(), coin: 'BCH', coen: 1, coan: 'A' },
      { id: nanoid(), coin: 'DASH', coen: 4, coan: 'D' },
      { id: nanoid(), coin: 'AION', coen: 3, coan: 'B' },
      { id: nanoid(), coin: 'ETH', coen: 2, coan: 'C' },
      { id: nanoid(), coin: 'XLM', coen: 5, coan: 'E' },
    ],
  },
}
