import { clusterApiUrl } from '@solana/web3.js'

export const CLUSTERS = [
  {
    name: 'mainnet-beta',
    apiUrl: clusterApiUrl('mainnet-beta'),
    label: 'Mainnet Beta',
  },
  {
    name: 'devnet',
    apiUrl: 'https://api.devnet.solana.com',
    label: 'Devnet',
  },
  {
    name: 'testnet',
    apiUrl: clusterApiUrl('testnet'),
    label: 'Testnet',
  },
  {
    name: 'localnet',
    apiUrl: 'http://localhost:8899',
    label: null,
  },
]

export function clusterForEndpoint(endpoint) {
  return CLUSTERS.find(({ apiUrl }) => apiUrl === endpoint)
}
