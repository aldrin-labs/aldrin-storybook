import { MASTER_BUILD } from '@core/utils/config'

export const POOLS_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'
  : 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX'
  : 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'

console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
