// (2 ** 63) - 1

// staking
export const STAKING_FARMING_STATE_SIZE = 170
export const MINIMAL_STAKING_AMOUNT = 10 ** 6

export const CREATE_FARMING_TICKET_SOL_FEE = 0.00495552

export const START_OF_LOG_WITH_AMOUNT_TO_CLAIM = 'Program log: '

export const Side = {
  Bid: { bid: {} },
  Ask: { ask: {} },
}

export * from '@core/solana/programs/staking/config'
