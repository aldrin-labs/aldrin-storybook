import { PublicKey } from '@solana/web3.js'

import { RIN_MINT } from '@sb/dexUtils/utils'

export const rinMint = new PublicKey(RIN_MINT)

export const AVAILABLE_TO_CLAIM_THRESHOLD = 0.1
