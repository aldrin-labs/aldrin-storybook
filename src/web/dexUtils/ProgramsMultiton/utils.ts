import { MASTER_BUILD } from '@core/utils/config'

export const POOLS_PROGRAM_ADDRESS = MASTER_BUILD
  ? process.env.POOLS_PROGRAM_ADDRESS
  : 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'

export const STABLE_POOLS_PROGRAM_ADDRESS =
  process.env.STABLE_POOLS_PROGRAM_ADDRESS ||
  'RinFPaym3xbnndu4SfQPAt1NzQWTfqL34cvf9eafakk'

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS =
  process.env.STAKING_PROGRAM_ADDRESS ||
  'FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX'

console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)

export const getPoolsProgramAddress = ({
  isStablePool,
}: {
  isStablePool: boolean
}) => (isStablePool ? STABLE_POOLS_PROGRAM_ADDRESS : POOLS_PROGRAM_ADDRESS)
