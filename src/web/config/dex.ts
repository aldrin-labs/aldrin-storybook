import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { MAINNET_BETA_ENDPOINT } from '../dexUtils/connection';

export const TAKER_FEE = 0.0022
export const DEX_PID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
export const DEVNET_DEX_PID = new PublicKey("DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY")

const DEX_PIDS = {
  [MAINNET_BETA_ENDPOINT]: DEX_PID,
  [clusterApiUrl('testnet')]: DEX_PID,
  'https://api.devnet.solana.com': DEVNET_DEX_PID,
  'http://127.0.0.1:8899': DEX_PID,
}

export const getDexProgramIdByEndpoint = (endpoint: string) => {
  return DEX_PIDS[endpoint]
}