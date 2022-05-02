import { blob, struct, u8 } from '@solana/buffer-layout'
import { PublicKey } from '@solana/web3.js'

import { publicKey, uint64 } from '../../layout'
import { VESTING_PROGRAM_ADDRESS } from '../../ProgramsMultiton/utils'
import { Vesting } from '../types'

export const vestingAddress = new PublicKey(VESTING_PROGRAM_ADDRESS)

export const VESTING_LAYOUT = struct<Vesting>([
  blob(8, 'padding'),
  publicKey('beneficiary'),
  publicKey('mint'),
  publicKey('vault'),
  publicKey('grantor'),
  uint64('outstanding'),
  uint64('startBalance'),
  uint64('createdTs', true),
  uint64('startTs', true),
  uint64('endTs', true),
  uint64('periodCount', true),
  uint64('whitelistOwned'),
  u8('nonce'),
  struct([publicKey('program'), publicKey('metadata')], 'realizor'),
])
