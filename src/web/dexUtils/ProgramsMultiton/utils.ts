export const POOLS_PROGRAM_ADDRESS = process.env.POOLS_PROGRAM_ADDRESS || 'RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx'

export const POOLS_V2_PROGRAM_ADDRESS = process.env.POOLS_V2_PROGRAM_ADDRESS || 'RinFPaym3xbnndu4SfQPAt1NzQWTfqL34cvf9eafakk'

export const MARKET_ORDER_PROGRAM_ADDRESS = 'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

export const STAKING_PROGRAM_ADDRESS = process.env.STAKING_PROGRAM_ADDRESS || 'rinajRPUgiiW2rG6uieXvcNNQNaWr9ZcMmqo28VvXfa'

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
