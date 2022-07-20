import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import * as BufferLayout from '@solana/buffer-layout'
import { Connection, PublicKey } from '@solana/web3.js'

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
])

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(44),
  BufferLayout.u8('decimals'),
  BufferLayout.u8('initialized'),
  BufferLayout.blob(36),
])

export function parseTokenAccountData(data) {
  const { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data)
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
  }
}

export function parseTokenMintData(data) {
  const { decimals, initialized } = MINT_LAYOUT.decode(data)
  return { decimals, initialized }
}

export function getOwnedAccountsFilters(publicKey) {
  return [
    {
      memcmp: {
        offset: ACCOUNT_LAYOUT.offsetOf('owner'),
        bytes: publicKey.toBase58(),
      },
    },
    {
      dataSize: ACCOUNT_LAYOUT.span,
    },
  ]
}

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export async function getTokenAccountsByOwner(
  connection: Connection,
  publicKey: PublicKey
) {
  const result = await connection.getTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  })

  return result.value.map(
    ({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data,
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  )
}

export async function getOwnedTokenAccounts(connection, publicKey) {
  const filters = getOwnedAccountsFilters(publicKey)
  const resp = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters,
  })
  return resp.map(
    ({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data,
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  )
}

export async function getTokenAccountInfo(connection, ownerAddress) {
  const [splAccounts, account] = await Promise.all([
    getTokenAccountsByOwner(connection, ownerAddress),
    connection.getAccountInfo(ownerAddress),
  ])

  const parsedSplAccounts = splAccounts.map(({ publicKey, accountInfo }) => {
    return {
      pubkey: publicKey,
      account: accountInfo,
      effectiveMint: parseTokenAccountData(accountInfo.data).mint,
    }
  })
  return parsedSplAccounts.concat({
    pubkey: ownerAddress,
    account,
    effectiveMint: WRAPPED_SOL_MINT,
  })
}
