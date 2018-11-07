import { Head, Data } from './index.types'
import nanoid from 'nanoid'

export const mock: { head: Head[]; data: Data } = {
  head: [
    { id: 'coin', isNumber: true, label: 'Coin' },
    { id: 'coen', isNumber: true, label: 'Coen' },
    { id: 'coan', isNumber: true, label: 'Coan' },
  ],
  data: {
    body: [
      {
        id: '1',
        coin: 1,
        coen: 2,
        coan: 3,
      },
      { id: nanoid(), coin: 2, coen: 4, coan: 7 },
      { id: nanoid(), coin: 3, coen: 4, coan: 7 },
    ],
  },
}
