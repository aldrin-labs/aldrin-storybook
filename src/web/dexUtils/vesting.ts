import bs58 from 'bs58'
import BN from 'bn.js'
import { Program, Provider } from '@project-serum/anchor/ts/dist/esm/index'
import { TokenInstructions } from '@project-serum/serum'
import { getOwnedAccountsFilters } from './tokens'
import { simulateTransaction } from './send'

import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { WalletAdapter } from './adapters'
import { sendAndConfirmTransactionViaWallet } from './token/utils/send-and-confirm-transaction-via-wallet'
import { Token } from './token/token'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'

const LookupJSON = require('./lookup.json')
// const CCAI_MINT = 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp'
export const CCAI_MINT = 'CbpoTe851zHXfMtGJvLy29n2XdGEuQYedt6yxgMXZf6V'
export const CCAI_TOKEN_DECIMALS = 9
export const VESTING_PROGRAM_ADDRESS = process.env.VESTING_PROGRAM_ADDRESS || 'EwA6aaET9TpWzi9cRmYDfRQC6kg8DjA6hNnuWsCo6WEU'

export async function getOwnedVestingAccounts(
  connection: Connection,
  publicKey: PublicKey
) {
  let filters = getOwnedAccountsFilters(publicKey)
  let resp = await connection._rpcRequest('getProgramAccounts', [
    VESTING_PROGRAM_ADDRESS,
    {
      commitment: connection.commitment,
      filters,
    },
  ])

  if (resp.error) {
    throw new Error(
      'failed to get token accounts owned by ' +
        publicKey.toBase58() +
        ': ' +
        resp.error.message
    )
  }

  return resp.result
    .map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data: bs58.decode(data),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    }))
    .filter(({ accountInfo }) => {
      // TODO: remove this check once mainnet is updated
      return filters.every((filter) => {
        if (filter.dataSize) {
          return accountInfo.data.length === filter.dataSize
        } else if (filter.memcmp) {
          let filterBytes = bs58.decode(filter.memcmp.bytes)
          return accountInfo.data
            .slice(
              filter.memcmp.offset,
              filter.memcmp.offset + filterBytes.length
            )
            .equals(filterBytes)
        }
        return false
      })
    })
}

export const getMaxWithdrawBalance = async ({
  wallet,
  connection,
  vestingAccountPubkey,
}: {
  wallet: WalletAdapter
  connection: Connection
  vestingAccountPubkey?: PublicKey
}) => {
  const vestingProgram_idl = LookupJSON
  const vestingProgramId = new PublicKey(VESTING_PROGRAM_ADDRESS)

  const vestingProgram = new Program(
    vestingProgram_idl,
    vestingProgramId,
    new Provider(connection, wallet, {
      preflightCommitment: 'recent',
      commitment: 'recent',
    })
  )

  let vesting = vestingAccountPubkey

  if (!vesting) {
    const vestingAccountPubkey = await getOwnedVestingAccounts(
      connection,
      wallet.publicKey
    )

    console.log('result', vestingAccountPubkey.toString())
    if (vestingAccountPubkey.length === 0) {
      console.log('not owner of ccai tokens')
      return 0
    }

    vesting = vestingAccountPubkey[0].publicKey
  }

  const availableWithdrawalInstruction = await vestingProgram.instruction.availableForWithdrawal(
    {
      accounts: {
        vesting: vesting,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  )

  const availableWithdrawalTransaction = new Transaction().add(
    availableWithdrawalInstruction
  )
  availableWithdrawalTransaction.feePayer = wallet.publicKey

  const availableWithdrawalTxSignature = await simulateTransaction(
    connection,
    availableWithdrawalTransaction,
    'singleGossip'
  )

  const msg = availableWithdrawalTxSignature?.value?.logs[1]
  console.log('msg', availableWithdrawalTxSignature, msg)
  if (!msg) return 0
  const availableFunds = JSON.parse(msg.substr(msg.indexOf('{'))).result

  return availableFunds
}

export const getVestingProgramAccountFromAccount = async ({
  wallet,
  connection,
  vestingAccount,
}: {
  wallet: WalletAdapter
  connection: Connection
  vestingAccount: PublicKey
}) => {
  const vestingProgram_idl = LookupJSON
  const vestingProgramId = new PublicKey(VESTING_PROGRAM_ADDRESS)

  const vestingProgram = new Program(
    vestingProgram_idl,
    vestingProgramId,
    new Provider(connection, wallet, {
      preflightCommitment: 'recent',
      commitment: 'recent',
    })
  )

  return await vestingProgram.account.vesting(vestingAccount)
}

export const withdrawVested = async ({
  wallet,
  connection,
  allTokensData,
}: {
  wallet: WalletAdapter
  connection: Connection
  allTokensData: TokenInfo[]
}) => {
  const mint = new PublicKey(CCAI_MINT)
  const vestingProgram_idl = LookupJSON
  const vestingProgramId = new PublicKey(VESTING_PROGRAM_ADDRESS)

  const vestingProgram = new Program(
    vestingProgram_idl,
    vestingProgramId,
    new Provider(connection, wallet, {
      preflightCommitment: 'recent',
      commitment: 'recent',
    })
  )

  const vestingAccountPubkey = await getOwnedVestingAccounts(
    connection,
    wallet.publicKey
  )

  if (vestingAccountPubkey.length === 0) {
    console.log('not owner of ccai tokens')
    return
  }

  const vesting = vestingAccountPubkey[0].publicKey
  let vestingAccount = await getVestingProgramAccountFromAccount({
    wallet,
    connection,
    vestingAccount: vesting,
  })

  const [vestingSigner] = await PublicKey.findProgramAddress(
    [vesting.toBuffer()],
    vestingProgram.programId
  )

  const availableFunds = await getMaxWithdrawBalance({
    wallet,
    connection,
    vestingAccountPubkey: vesting,
  })

  let withdrawTokenAddress = null

  const { address: WITHDRAWAL_TOKEN_ACCOUNT } = getTokenDataByMint(
    allTokensData,
    mint.toString()
  )

  if (WITHDRAWAL_TOKEN_ACCOUNT) {
    withdrawTokenAddress = new PublicKey(WITHDRAWAL_TOKEN_ACCOUNT)
  } else {
    const mintToken = new Token(wallet, connection, mint, TOKEN_PROGRAM_ID)
    const [
      tokenAccount,
      tokenAccountSignature,
      tokenAccountTransaction,
    ] = await mintToken.createAccount(wallet.publicKey)

    await sendAndConfirmTransactionViaWallet(
      wallet,
      connection,
      tokenAccountTransaction,
      tokenAccountSignature
    )

    withdrawTokenAddress = tokenAccount
  }

  console.log(
    'Witdrawing available funds to the account ' +
      withdrawTokenAddress?.toString()
  )

  const withdrawInstruction = await vestingProgram.instruction.withdraw(
    new BN(availableFunds),
    {
      accounts: {
        vesting: vesting,
        beneficiary: wallet.publicKey,
        vault: vestingAccount.vault,
        vestingSigner,
        token: withdrawTokenAddress,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  )

  const withdrawTransaction = new Transaction().add(withdrawInstruction)
  withdrawTransaction.feePayer = wallet.publicKey

  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    withdrawTransaction
  )

  console.log(
    '\nGetting account data of the vesting created\nVesting address ' +
      vesting.toBase58()
  )

  vestingAccount = await getVestingProgramAccountFromAccount({
    wallet,
    connection,
    vestingAccount: vesting,
  })

  console.log({
    beneficiary: vestingAccount.beneficiary.toBase58(),
    mint: vestingAccount.mint.toBase58(),
    vault: vestingAccount.vault.toBase58(),
    grantor: vestingAccount.grantor.toBase58(),
    outstanding: vestingAccount.outstanding.toString(),
    startBalance: vestingAccount.startBalance.toString(), // / perdiodCount
    createdTs: vestingAccount.createdTs.toString(),
    startTs: vestingAccount.startTs.toString(),
    endTs: vestingAccount.endTs.toString(),
    periodCount: vestingAccount.periodCount.toString(),
    whitelistOwned: vestingAccount.whitelistOwned.toString(),
    nonce: vestingAccount.nonce,
    realizor: vestingAccount.realizor,
  })
}
