import { MASTER_BUILD } from '@core/utils/config'

const poolProgramAddress = MASTER_BUILD
  ? process.env.POOLS_PROGRAM_ADDRESS
  // : 'RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx'
  : 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'

if (!poolProgramAddress) {
  throw new Error('Pool address not provided')
}

export const POOLS_PROGRAM_ADDRESS = poolProgramAddress

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'


export const stakingProgramAddress = MASTER_BUILD
  ? process.env.STAKING_PROGRAM_ADDRESS
  : 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'


if (!stakingProgramAddress) {
  throw new Error('Staking address not provided')
}

export const STAKING_PROGRAM_ADDRESS = stakingProgramAddress


console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
