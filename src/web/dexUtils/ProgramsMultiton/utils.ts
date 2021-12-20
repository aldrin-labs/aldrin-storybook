import { MASTER_BUILD } from '@core/utils/config'

export const POOLS_PROGRAM_ADDRESS =
  process.env.POOLS_PROGRAM_ADDRESS ||
  'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'

export const POOLS_V2_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'STBLHfddQjdNbDkTbXCgN7oJ9pjC5cCZb6FTN5TYjNc'
  : 'RinFPaym3xbnndu4SfQPAt1NzQWTfqL34cvf9eafakk'

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'
  : 'FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX'

export const VESTING_PROGRAM_ADDRESS =
  process.env.VESTING_PROGRAM_ADDRESS ||
  '77WyS2Q4QHRgnLJZyduowV9dGVjHFqfHc2F3fVvuAdB8'

export const FEE_OWNER_ACCOUNT =
  process.env.FEE_OWNER_ACCOUNT ||
  '9VHVV44zDSmmdDMUHk4fwotXioimN78yzNDgzaVUP5Fb'

export const POOL_AUTHORITY =
  process.env.POOL_AUTHORITY || 'EAWfgtTAFe2pYbDsTN57t6yoZyxWSBEWoszxQe8PSbvC'

console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
console.log(`POOLS_V2_PROGRAM_ADDRESS: ${POOLS_V2_PROGRAM_ADDRESS}`)

export const getPoolsProgramAddress = ({
  curveType,
}: {
  curveType?: number | null
}) => {
  if (curveType !== null && curveType !== undefined) {
    return POOLS_V2_PROGRAM_ADDRESS
  }

  return POOLS_PROGRAM_ADDRESS
}
