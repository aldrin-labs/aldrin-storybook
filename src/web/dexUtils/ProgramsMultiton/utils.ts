import { MASTER_BUILD } from '@core/utils/config'

export const POOLS_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'
  : 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'

export const POOLS_V2_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4'
  : 'CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4'

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'
  : 'FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX'

console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
console.log(`POOLS_V2_PROGRAM_ADDRESS: ${POOLS_V2_PROGRAM_ADDRESS}`)

export const getPoolsProgramAddress = ({
  curveType,
}: {
  curveType: number | null
}) => {
  if (curveType !== null && curveType !== undefined) {
    return POOLS_V2_PROGRAM_ADDRESS
  }

  return POOLS_PROGRAM_ADDRESS
}
