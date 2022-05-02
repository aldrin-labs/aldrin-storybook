import { ConfirmOptions } from '@solana/web3.js'

import { MASTER_BUILD } from '@core/utils/config'

export const POOLS_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'
  : 'RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx'
// RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx

export const POOLS_V2_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4'
  : 'RinFPaym3xbnndu4SfQPAt1NzQWTfqL34cvf9eafakk'
// RinFPaym3xbnndu4SfQPAt1NzQWTfqL34cvf9eafakk

export const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS = MASTER_BUILD
  ? 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'
  : 'FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX'
// FhcygzxWnn782qsSryBeZn2kXZ3sAfCJ8NEoFjBeZsVX

export const VESTING_PROGRAM_ADDRESS =
  '77WyS2Q4QHRgnLJZyduowV9dGVjHFqfHc2F3fVvuAdB8'

export const TWAMM_PROGRAM_ADDRESS =
  'TWAPR9s1DEhrr8tuFbwEPws5moHXebMotqU85wwVmvU'

export const FEE_OWNER_ACCOUNT = MASTER_BUILD
  ? 'D7FkvSLw8rq8Ydh43tBViSQuST2sBczEStbWudFhR6L'
  : '9VHVV44zDSmmdDMUHk4fwotXioimN78yzNDgzaVUP5Fb'
// 9VHVV44zDSmmdDMUHk4fwotXioimN78yzNDgzaVUP5Fb
export const POOL_AUTHORITY = MASTER_BUILD
  ? 'BqSGA2WdiQXA2cC1EdGDnVD615A4nYEAq49K3fz2hNBo'
  : 'EAWfgtTAFe2pYbDsTN57t6yoZyxWSBEWoszxQe8PSbvC'
// EAWfgtTAFe2pYbDsTN57t6yoZyxWSBEWoszxQe8PSbvC
export const MARINADE_REF_ADDRESS =
  'ALDKL1QUkHnVK7a7hsLNzs1VNqUKfQAaZLg6ER6YTEHb'

export const PLUTONIANS_STAKING_PROGRAMM_ADDRESS = MASTER_BUILD
  ? 'PLUSqEwLLUrkrGLJvBjevMQtpomPxcLHPjQQ6ZNvTsL'
  : // : 'DEVPSeh87GKPyWdowW4MgFwy6qLTs3KTm5vKppGNh6w4'
    'PLdvMFEzQmHdsZeHH87ZHqRGZFbYFfhZWTCf7pRqGga'

export const PLUTONIANS_STAKING_POOL_ADDRESS = MASTER_BUILD
  ? 'AnsJbrAsV6bU8gqAL45xdmwsjdLe1oTPgLemAbNuUYwA'
  : // : '3cbB8H3h2kfAdMkSV5cNKXj5Z8Kkpv9fk9dJ4P16Fw22'
    '58wwrPAfWNeaH2boYD7FeQhXE4AV55ybhMR4GZ824Q5G'

// Plutonians staking reward
export const PU238_TOKEN_MINT = MASTER_BUILD
  ? '7p6zGHdmWHvCH4Lsik2MoMBXqPGhFbSPSceSBXd8KNEC'
  : // : '3UGQ4Xpx8RBBjRGkTktm7j9raPn5tv91bScVKjNMyBiD' // TOBE: CHANGE WHEN IGOR CREATE TIERS
    'pUjHn3jn4MsATkzosn1KBUtZz5pZJBVEGBtxKxBcj42' // TOBE: CHANGE WHEN IGOR CREATE TIERS

console.log(`POOLS_PROGRAM_ADDRESS: ${POOLS_PROGRAM_ADDRESS}`)
console.log(`STAKING_PROGRAM_ADDRESS: ${STAKING_PROGRAM_ADDRESS}`)
console.log(`POOLS_V2_PROGRAM_ADDRESS: ${POOLS_V2_PROGRAM_ADDRESS}`)
console.log(`TWAMM_PROGRAM_ADDRESS: ${TWAMM_PROGRAM_ADDRESS}`)
console.log(
  `PLUTONIANS_STAKING_PROGRAMM_ADDRESS: ${PLUTONIANS_STAKING_PROGRAMM_ADDRESS}`
)

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

export const defaultOptions = (): ConfirmOptions => ({
  commitment: 'confirmed',
  preflightCommitment: 'confirmed',
})
