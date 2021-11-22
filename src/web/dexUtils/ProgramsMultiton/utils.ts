import { MASTER_BUILD } from '@core/utils/config'

const poolProgramAddress = MASTER_BUILD
  ? process.env.POOLS_PROGRAM_ADDRESS
  : 'RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx'

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


const feesOwnerAccount = MASTER_BUILD
  ? process.env.FEE_OWNER_ACCOUNT
  : '9VHVV44zDSmmdDMUHk4fwotXioimN78yzNDgzaVUP5Fb'


if (!feesOwnerAccount) {
  throw new Error('Fees owner account not provided')
}

export const FEE_OWNER_ACCOUNT = feesOwnerAccount


const poolAuthority = MASTER_BUILD
  ? process.env.POOL_AUTHORITY
  : 'EAWfgtTAFe2pYbDsTN57t6yoZyxWSBEWoszxQe8PSbvC'


if (!poolAuthority) {
  throw new Error('Pool authority public key not provided')
}

export const POOL_AUTHORITY = poolAuthority



console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
